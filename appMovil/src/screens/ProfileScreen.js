// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const ProfileScreen = ({ navigation }) => {
  const { user, updateUser, updateProfileImage, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    notifications: user?.notifications !== undefined ? user.notifications : true,
  });

  const [editingField, setEditingField] = useState(null); // 'name' | 'email' | 'phone' | null
  const [selectedImage, setSelectedImage] = useState(null);
  const [nameInput, setNameInput] = useState(''); // para editar nombre completo

  const {
    alertConfig,
    hideAlert,
    showSuccess,
    showError,
    showLogoutConfirm,
    showPermissionRequired,
    showImagePickerOptions,
  } = useCustomAlert();

  // Sincroniza datos cuando cambia el usuario
  useEffect(() => {
    if (user) {
      const f = user.firstName || '';
      const l = user.lastName || '';
      setProfileData(prev => ({
        ...prev,
        firstName: f,
        lastName: l,
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
      }));
      if (editingField === 'name') {
        setNameInput([f, l].filter(Boolean).join(' ').trim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /** --------- EDITAR CAMPOS --------- **/
  const startEdit = (field) => {
    if (field === 'name') {
      const full = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ').trim();
      setNameInput(full);
    }
    setEditingField(field);
  };

  const saveField = async (field, value) => {
    try {
      let updateData = null;

      if (field === 'name') {
        const v = (value || '').trim();
        if (!v) {
          setEditingField(null);
          return;
        }
        const [firstName, ...rest] = v.split(/\s+/);
        updateData = { firstName, lastName: rest.join(' ') };
      } else if (field === 'email') {
        const v = (value || '').trim();
        if (!v) {
          setEditingField(null);
          return;
        }
        updateData = { email: v };
      } else if (field === 'phone') {
        const v = (value || '').trim();
        if (!v) {
          setEditingField(null);
          return;
        }
        updateData = { phone: v };
      }

      if (updateData) {
        const result = await updateUser(updateData);
        if (result?.success) {
          setProfileData(prev => ({
            ...prev,
            ...('firstName' in updateData ? { firstName: updateData.firstName } : null),
            ...('lastName' in updateData ? { lastName: updateData.lastName } : null),
            ...('email' in updateData ? { email: updateData.email } : null),
            ...('phone' in updateData ? { phone: updateData.phone } : null),
          }));
          showSuccess('Éxito', 'Datos actualizados');
        } else {
          showError('Error', result?.error || 'No se pudo actualizar el perfil');
        }
      }
    } catch (err) {
      showError('Error', 'No se pudo actualizar. Intenta de nuevo.');
    } finally {
      Keyboard.dismiss();
      setEditingField(null);
    }
  };

  /** --------- FOTO DE PERFIL --------- **/
  const pickImage = () => {
    showImagePickerOptions(
      () => pickFromCamera(),
      () => pickFromGallery(),
      () => {}
    );
  };

  const pickFromCamera = async () => {
    try {
      let camPerm = await ImagePicker.getCameraPermissionsAsync();
      if (camPerm?.status !== 'granted') {
        camPerm = await ImagePicker.requestCameraPermissionsAsync();
      }
      if (camPerm?.status !== 'granted') {
        showPermissionRequired(
          'Permisos de cámara requeridos',
          'Activa el permiso de Cámara para tomar tu foto.',
          () => showError('Instrucciones', 'Ajustes > App > Permisos > Cámara')
        );
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (res?.canceled) return;

      const uri = res?.assets?.[0]?.uri;
      if (!uri) {
        showError('Error', 'No se obtuvo una imagen válida.');
        return;
      }
      await uploadProfileImage(uri);
    } catch (e) {
      showError('Error de cámara', 'No se pudo tomar la foto.');
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
          'Activa el permiso de Fotos para seleccionar tu imagen.',
          () => showError('Instrucciones', 'Ajustes > App > Permisos > Fotos')
        );
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (res?.canceled) return;

      const uri = res?.assets?.[0]?.uri;
      if (!uri) {
        showError('Error', 'No se obtuvo una imagen válida.');
        return;
      }
      await uploadProfileImage(uri);
    } catch (e) {
      showError('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const uploadProfileImage = async (uri) => {
    try {
      setSelectedImage(uri);
      const r = await updateProfileImage(uri);
      if (r?.success) {
        showSuccess('Éxito', 'Foto de perfil actualizada');
        setSelectedImage(null);
      } else {
        showError('Error', r?.error || 'No se pudo actualizar la foto');
      }
    } catch {
      showError('Error', 'No se pudo subir la imagen.');
      setSelectedImage(null);
    }
  };

  /** --------- LOGOUT --------- **/
  const handleLogout = () => {
    showLogoutConfirm(
      async () => {
        try {
          await logout();
          navigation?.reset?.({ index: 0, routes: [{ name: 'Login' }] });
        } catch {
          showError('Error', 'Error al desconectarse');
        }
      },
      () => {}
    );
  };

  /** --------- RENDER HELPERS --------- **/
  const renderNameField = () => {
    const isEditing = editingField === 'name';
    const displayName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ').trim();

    return (
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Text style={styles.fieldLabel}>Tu nombre</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputField}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Nombre completo"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => saveField('name', nameInput)}
              onBlur={() => saveField('name', nameInput)}
            />
          ) : (
            <Text style={styles.fieldValue}>{displayName || 'Nombre completo'}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => (isEditing ? saveField('name', nameInput) : startEdit('name'))}
        >
          <Ionicons name={isEditing ? 'checkmark' : 'pencil-outline'} size={18} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEditableField = (label, field, placeholder, keyboardType = 'default') => {
    const isEditing = editingField === field;
    const value = profileData[field] ?? '';

    return (
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Text style={styles.fieldLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputField}
              value={value}
              onChangeText={(t) => setProfileData(prev => ({ ...prev, [field]: t }))}
              placeholder={placeholder}
              autoFocus
              keyboardType={keyboardType}
              returnKeyType="done"
              onSubmitEditing={() => saveField(field, profileData[field])}
              onBlur={() => saveField(field, profileData[field])}
              autoCapitalize={field === 'email' ? 'none' : 'sentences'}
            />
          ) : (
            <Text style={styles.fieldValue}>{value || placeholder}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => (isEditing ? saveField(field, profileData[field]) : startEdit(field))}
        >
          <Ionicons name={isEditing ? 'checkmark' : 'pencil-outline'} size={18} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
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
              source={
                selectedImage || user?.profilePicture
                  ? { uri: selectedImage || user.profilePicture }
                  : require('../../assets/Usuarionuevo.jpg')
              }
              style={styles.profileImage}
              onError={(e) => console.log('Error loading image:', e?.nativeEvent?.error)}
            />
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <View style={styles.fieldsContainer}>
          {renderNameField()}
          {renderEditableField('Tu correo', 'email', 'correo@ejemplo.com', 'email-address')}
          {renderEditableField('Tu teléfono', 'phone', 'Número de teléfono', 'phone-pad')}

          {/* Contraseña (navega a pantalla de cambio) */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tu contraseña</Text>
              <Text style={styles.fieldValue}>••••••••••</Text>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('ChangePassword')}>
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Privacidad */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Política de privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>

          {/* Términos */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => navigation.navigate('TermsConditions')}>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Términos y condiciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
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
  container: { flex: 1, backgroundColor: 'rgba(255, 221, 221, 0.37)' },
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
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f8f9fa',
    justifyContent: 'center', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 44 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2d2d2d' },
  scrollView: { flex: 1, paddingHorizontal: 16 },

  profileImageSection: { alignItems: 'center', paddingVertical: 32 },
  profileImageContainer: {
    width: 150, height: 150, borderRadius: 75, overflow: 'hidden', backgroundColor: '#f8f9fa',
    borderWidth: 4, borderColor: '#f48fb1', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 75 },

  fieldsContainer: {
    backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4',
  },
  fieldContent: { flex: 1 },
  fieldLabel: { fontSize: 14, color: '#666', fontWeight: '500', marginBottom: 4 },
  fieldValue: { fontSize: 16, color: '#2d2d2d', fontWeight: '600' },
  editIcon: { padding: 8 },

  inputField: {
    borderWidth: 1, borderColor: '#f1a5bf', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#2d2d2d',
  },

  logoutRow: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  logoutText: { fontSize: 16, color: '#ff4757', fontWeight: '600' },
});

export default ProfileScreen;
