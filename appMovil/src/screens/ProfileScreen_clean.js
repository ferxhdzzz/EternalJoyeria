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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

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
          Alert.alert('Éxito', 'Campo actualizado correctamente');
        } else {
          Alert.alert('Error', 'No se pudo actualizar el campo');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el campo');
    }
    
    setEditingField(null);
  };

  const pickImage = async () => {
    try {
      let camPerm = await ImagePicker.getCameraPermissionsAsync();
      if (camPerm?.status !== 'granted') {
        camPerm = await ImagePicker.requestCameraPermissionsAsync();
      }
      if (camPerm?.status !== 'granted') {
        Alert.alert(
          'Permisos de cámara requeridos',
          'Necesitamos acceso a la cámara para tomar tu foto de perfil.',
          [{ text: 'OK' }]
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
        return Alert.alert(
          'Captura cancelada',
          '¿Deseas elegir una foto de tu galería?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Sí', onPress: () => pickFromGallery() },
          ]
        );
      }

      const assets = Array.isArray(cameraResult.assets) ? cameraResult.assets : [];
      const first = assets[0];
      const imageUri = first?.uri;
      if (!imageUri) {
        return Alert.alert(
          'Sin imagen',
          'No se obtuvo una imagen válida. ¿Deseas elegir una foto de tu galería?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Sí', onPress: () => pickFromGallery() },
          ]
        );
      }

      setSelectedImage(imageUri);

      const uploadRes = await updateProfileImage(imageUri);
      if (uploadRes?.success) {
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente', [{ text: 'OK' }]);
        setSelectedImage(null);
      } else {
        Alert.alert('Error', uploadRes?.error || 'No se pudo actualizar la foto');
      }
    } catch (error) {
      console.log('Camera capture error:', error);
      Alert.alert(
        'Error con la cámara',
        '¿Deseas elegir una foto de tu galería en su lugar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir galería', onPress: () => pickFromGallery() },
        ]
      );
    }
  };

  const pickFromGallery = async () => {
    try {
      let libPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (libPerm?.status !== 'granted') {
        libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (libPerm?.status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para elegir una imagen.');
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
      if (!imageUri) return;

      setSelectedImage(imageUri);
      const uploadRes = await updateProfileImage(imageUri);
      if (uploadRes?.success) {
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente', [{ text: 'OK' }]);
        setSelectedImage(null);
      } else {
        Alert.alert('Error', uploadRes?.error || 'No se pudo actualizar la foto');
      }
    } catch (e) {
      console.log('Gallery pick error:', e);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres desconectarte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Desconectarse', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Error al cerrar sesión');
            }
          }
        }
      ]
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image 
              source={selectedImage || user?.photoURL 
                ? { uri: selectedImage?.uri || user.photoURL } 
                : require('../../assets/Usuarionuevo.jpg')
              } 
              style={styles.profilePicture} 
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>
            {`${profileData.firstName} ${profileData.lastName}`.trim() || 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          {renderEditableField('Nombre', 'firstName', 'Ingresa tu nombre')}
          {renderEditableField('Apellidos', 'lastName', 'Ingresa tus apellidos')}
          {renderEditableField('Correo electrónico', 'email', 'correo@ejemplo.com')}
          {renderEditableField('Teléfono', 'phone', 'Ingresa tu teléfono')}
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                <Ionicons name="key-outline" size={20} color="#EC4899" />
              </View>
              <Text style={styles.menuItemText}>Cambiar contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          {renderSelectionField(
            'Idioma', 
            'language', 
            'Español',
            () => navigation.navigate('LanguageSelection')
          )}
          {renderSelectionField(
            'Moneda', 
            'currency', 
            'Peso Mexicano (MXN)',
            () => navigation.navigate('CurrencySelection')
          )}
        </View>
        
        {/* Legal & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Ionicons name="document-text-outline" size={20} color="#6366F1" />
              </View>
              <Text style={styles.menuItemText}>Términos y condiciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.menuItemText}>Política de privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>Centro de ayuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#EC4899',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#F8E1E9',
    backgroundColor: '#FFF9FA',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#EC4899',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  fieldContainer: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#2D2D2D',
    paddingVertical: 8,
    paddingRight: 10,
  },
  editButton: {
    padding: 6,
    backgroundColor: '#F8F0F3',
    borderRadius: 8,
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
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#2D2D2D',
    paddingVertical: 8,
    flex: 1,
  },
});

export default ProfileScreen;
