import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
          showError('Error', 'Error al cerrar sesión');
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
    <LinearGradient
      colors={['#ff6ec7', '#ff9a9e', '#fecfef']}
      style={styles.container}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4a148c" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Seccion de foto de perfil */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(252, 228, 236, 0.8)']}
              style={styles.avatarGradient}
            >
              <Image 
                source={selectedImage || user?.profilePicture 
                  ? { uri: selectedImage || user.profilePicture } 
                  : require('../../assets/Usuarionuevo.jpg')
                } 
                style={styles.profilePicture} 
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)} 
              />
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                style={styles.cameraIcon}
              >
                <Ionicons name="camera" size={22} color="#FFF" />
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.userName}>
            {`${profileData.firstName} ${profileData.lastName}`.trim() || 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
        </View>

        {/* Seccion de informacion personal */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 228, 236, 0.8)']}
            style={styles.sectionGradient}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={20} color="#6a1b9a" />
              <Text style={styles.sectionTitle}>Información Personal</Text>
            </View>
          
          {renderEditableField('Nombres', 'firstName', 'Ingresa tu nombre')}
          {renderEditableField('Apellidos', 'lastName', 'Ingresa tus apellidos')}
          {renderEditableField('Correo electrónico', 'email', 'correo@ejemplo.com')}
          {renderEditableField('Teléfono', 'phone', 'Ingresa tu teléfono')}
          
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <View style={styles.menuItemLeft}>
                <LinearGradient
                  colors={['#e91e63', '#ad1457']}
                  style={styles.menuIcon}
                >
                  <Ionicons name="key" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.menuItemText}>Cambiar contraseña</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8e24aa" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* Seccion de ayuda y soporte */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 228, 236, 0.8)']}
            style={styles.sectionGradient}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle" size={20} color="#6a1b9a" />
              <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
            </View>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TermsConditions')}>
              <View style={styles.menuItemLeft}>
                <LinearGradient
                  colors={['#6366f1', '#4f46e5']}
                  style={styles.menuIcon}
                >
                  <Ionicons name="document-text" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.menuItemText}>Términos y condiciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8e24aa" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
              <View style={styles.menuItemLeft}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.menuIcon}
                >
                  <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.menuItemText}>Política de privacidad</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8e24aa" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* Seccion de cerrar sesion */}
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.logoutButton}
        >
          <TouchableOpacity
            style={styles.logoutTouchable}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={22} color="#FFF" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
      
      {/* Componente de alerta */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        autoClose={alertConfig.autoClose}
        autoCloseDelay={alertConfig.autoCloseDelay}
        showIcon={alertConfig.showIcon}
        animationType={alertConfig.animationType}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerSpacer: {
    width: 45,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradient: {
    borderRadius: 80,
    padding: 8,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a148c',
    textAlign: 'center',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e91e63',
  },
  section: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionGradient: {
    padding: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(171, 71, 188, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a148c',
    flex: 1,
  },
  logoutButton: {
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 25,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#8e24aa',
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(171, 71, 188, 0.3)',
    paddingBottom: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#4a148c',
    paddingVertical: 10,
    paddingRight: 12,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#2D2D2D',
  },
  readonlyText: {
    fontSize: 16,
    color: '#4a148c',
    paddingVertical: 10,
    flex: 1,
    fontWeight: '500',
  },
});

export default ProfileScreen;
