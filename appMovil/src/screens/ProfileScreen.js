import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const ProfileScreen = ({ navigation, route }) => {
  const { user, updateUser, updateProfileImage, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    notifications: user?.notifications !== undefined ? user.notifications : true,
  });
  
  const [editingField, setEditingField] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showSuccess,
    showError,
    showLogoutConfirm,
    showPermissionRequired,
    showImagePickerOptions,
  } = useCustomAlert();

  // Sincroniza datos del perfil cuando cambia el usuario
  useEffect(() => {
    if (user) {
      let f = user.firstName || '';
      let l = user.lastName || '';
      // Fallback si backend devuelve 'name'
      if ((!f || !l) && typeof user.name === 'string') {
        const parts = user.name.trim().split(/\s+/);
        f = f || parts[0] || '';
        l = l || parts.slice(1).join(' ') || '';
      }

      setProfileData(prev => ({
        ...prev,
        firstName: f,
        lastName: l,
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
      }));
    }
  }, [user]);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = async (field, value) => {
    try {
      let updateData = {};
      
      if (field === 'firstName') {
        updateData.firstName = value;
      } else if (field === 'lastName') {
        updateData.lastName = value;
      } else if (field === 'phone') {
        updateData.phone = value;
      } else if (field === 'email') {
        updateData.email = value;
      }

      if (Object.keys(updateData).length > 0) {
        const result = await updateUser(updateData);
        if (result.success) {
          setProfileData(prev => ({ ...prev, ...updateData }));
          showSuccess('Éxito', 'Campo actualizado correctamente');
        } else {
          showError('Error', 'No se pudo actualizar el campo');
        }
      }
    } catch (error) {
      showError('Error', 'Error al actualizar el campo');
    }
    
    setEditingField(null);
  };

  // Función principal que muestra la alerta personalizada de selección
  const pickImage = () => {
    showImagePickerOptions(
      () => pickFromCamera(), // Acción para cámara
      () => pickFromGallery(), // Acción para galería
      () => {} // Acción para cancelar (no hacer nada)
    );
  };

  // Función para tomar foto con cámara
  const pickFromCamera = async () => {
    try {
      let camPerm = await ImagePicker.getCameraPermissionsAsync();
      if (camPerm?.status !== 'granted') {
        camPerm = await ImagePicker.requestCameraPermissionsAsync();
      }
      if (camPerm?.status !== 'granted') {
        showPermissionRequired(
          'Permisos de cámara requeridos',
          'Necesitamos acceso a la cámara para tomar tu foto de perfil.',
          () => {
            showError('Instrucciones', '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Cámara"\n4. Regresa a la app');
          },
          () => {}
        );
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!cameraResult || typeof cameraResult !== 'object') {
        throw new TypeError('Respuesta de cámara inválida');
      }

      if (cameraResult.canceled === true) {
        return; // Usuario canceló, no hacer nada
      }

      const assets = Array.isArray(cameraResult.assets) ? cameraResult.assets : [];
      const first = assets[0];
      const imageUri = first?.uri;
      if (!imageUri) {
        showError('Error', 'No se obtuvo una imagen válida de la cámara.');
        return;
      }

      await uploadProfileImage(imageUri);
    } catch (e) {
      console.log('Camera pick error:', e);
      showError('Error de cámara', 'No se pudo tomar la foto. Inténtalo de nuevo.');
    }
  };

  const pickFromGallery = async () => {
    try {
      let libPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (libPerm?.status !== 'granted') {
        libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (libPerm?.status !== 'granted') {
        showPermissionRequired(
          'Permisos de galería requeridos',
          'Necesitamos acceso a tu galería para seleccionar una foto de perfil.',
          () => {
            showError('Instrucciones', '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Fotos"\n4. Regresa a la app');
          },
          () => {}
        );
        return;
      }

      const libResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!libResult || libResult.canceled) return;

      const assets = Array.isArray(libResult.assets) ? libResult.assets : [];
      const first = assets[0];
      const imageUri = first?.uri;
      if (!imageUri) {
        showError('Error', 'No se obtuvo una imagen válida de la galería.');
        return;
      }

      await uploadProfileImage(imageUri);
    } catch (e) {
      console.log('Gallery pick error:', e);
      showError('Error', 'No se pudo seleccionar la imagen de la galería.');
    }
  };

  // Función centralizada para subir imagen de perfil
  const uploadProfileImage = async (imageUri) => {
    try {
      setSelectedImage(imageUri);
      const uploadRes = await updateProfileImage(imageUri);
      if (uploadRes?.success) {
        showSuccess('Éxito', 'Foto de perfil actualizada correctamente');
        setSelectedImage(null);
      } else {
        showError('Error', uploadRes?.error || 'No se pudo actualizar la foto');
      }
    } catch (error) {
      console.log('Upload profile image error:', error);
      showError('Error', 'No se pudo subir la imagen. Inténtalo de nuevo.');
      setSelectedImage(null);
    }
  };

  const handleLogout = async () => {
    showLogoutConfirm(
      async () => {
        try {
          await logout();
        } catch (error) {
          showError('Error', 'Error al desconectarse');
        }
      },
      () => {
        // Usuario canceló, no hacer nada
      }
    );
  };

  const renderEditableField = (label, field, placeholder) => {
    const isEditing = editingField === field;
    
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.inputContainer}>
          {isEditing ? (
            <TextInput
              style={styles.inputField}
              value={profileData[field]}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, [field]: text }))}
              placeholder={placeholder}
              onBlur={() => handleSaveField(field, profileData[field])}
              autoFocus
            />
          ) : (
            <Text style={styles.readonlyText}>{profileData[field] || placeholder}</Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSaveField(field, profileData[field]) : handleEditField(field)}
          >
            <Ionicons name={isEditing ? "checkmark" : "pencil"} size={16} color="#EC4899" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSelectionField = (label, field, value, onPress) => {
    return (
      <TouchableOpacity style={styles.selectionContainer} onPress={onPress}>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.selectionText}>{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#BBB" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#2d2d2d" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Datos del perfil</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Foto de perfil */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            <Image 
              source={selectedImage || user?.profilePicture 
                ? { uri: selectedImage || user.profilePicture } 
                : require('../../assets/Usuarionuevo.jpg')
              } 
              style={styles.profileImage} 
              onError={(e) => console.log('Error loading image:', e.nativeEvent.error)} 
            />
          </TouchableOpacity>
        </View>

        {/* Campos de informacion */}
        <View style={styles.fieldsContainer}>
          {/* Tu nombre */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tu nombre</Text>
              <Text style={styles.fieldValue}>
                {`${profileData.firstName} ${profileData.lastName}`.trim() || 'Nombre completo'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editIcon}
              onPress={() => handleEditField('firstName')}
            >
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Tu correo */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tu correo</Text>
              <Text style={styles.fieldValue}>
                {profileData.email || 'correo@ejemplo.com'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editIcon}
              onPress={() => handleEditField('email')}
            >
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Tu telefono */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tu teléfono</Text>
              <Text style={styles.fieldValue}>
                {profileData.phone || 'Número de teléfono'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editIcon}
              onPress={() => handleEditField('phone')}
            >
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Tu contraseña */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tu contraseña</Text>
              <Text style={styles.fieldValue}>••••••••••</Text>
            </View>
            <TouchableOpacity 
              style={styles.editIcon}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Politica de privacidad */}
          <TouchableOpacity 
            style={styles.fieldRow}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Política de privacidad</Text>
            </View>
          </TouchableOpacity>

          {/* Terminos y condiciones */}
          <TouchableOpacity 
            style={styles.fieldRow}
            onPress={() => navigation.navigate('TermsConditions')}
          >
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Términos y condiciones</Text>
            </View>
          </TouchableOpacity>

          {/* Desconectarse */}
          <TouchableOpacity 
            style={styles.logoutRow}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Desconectarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Foto de perfil
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 4,
    borderColor: '#f48fb1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  // Campos de informacion
  fieldsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: '600',
  },
  editIcon: {
    padding: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '600',
  },
});

export default ProfileScreen;
