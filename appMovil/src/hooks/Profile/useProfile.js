// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export const useProfile = (navigation) => {
  const { user, updateUser, updateProfileImage, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '**********',
    language: 'Español',
    currency: 'USD',
    notifications: true,
  });

  const [editingField, setEditingField] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : prev.name,
        email: user.email ?? prev.email,
        phone: user.phone ?? prev.phone,
      }));
    }
  }, [user]);

  const handleEditField = (field) => setEditingField(field);

  const handleSaveField = async (field, value) => {
    const v = (value ?? '').trim();
    if (!v) {
      setEditingField(null);
      return;
    }

    setIsLoading(true);
    try {
      let payload = null;
      if (field === 'name') {
        const [firstName, ...rest] = v.split(/\s+/);
        payload = { firstName, lastName: rest.join(' ') };
      } else if (field === 'phone') {
        payload = { phone: v };
      } else if (field === 'email') {
        payload = { email: v };
      } else if (field === 'password') {
        Alert.alert('Cambiar contraseña', 'Por seguridad, la contraseña se cambia desde “Cambiar contraseña”.');
        setEditingField(null);
        return;
      } else if (field === 'notifications') {
        setProfileData((prev) => ({ ...prev, notifications: v === 'true' || v === true }));
        Alert.alert('Listo', 'Preferencias actualizadas');
        setEditingField(null);
        return;
      }

      if (payload) {
        const result = await updateUser(payload);
        if (result?.success) {
          setProfileData((prev) => ({ ...prev, [field]: value }));
          Alert.alert('Éxito', 'Datos actualizados');
        } else {
          Alert.alert('Error', result?.error || 'No se pudo actualizar el perfil');
        }
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setEditingField(null);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = newStatus;
        if (status !== 'granted') {
          Alert.alert('Permisos requeridos', 'Activa el acceso a Fotos para cambiar tu imagen.');
          setIsLoading(false);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        const r = await updateProfileImage(imageUri);
        if (r?.success) {
          Alert.alert('Éxito', 'Foto de perfil actualizada');
        } else {
          Alert.alert('Error', r?.error || 'No se pudo actualizar la foto');
          setSelectedImage(null);
        }
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      setSelectedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Quieres desconectarte?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            await logout();
            navigation?.reset?.({ index: 0, routes: [{ name: 'Login' }] });
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleNotificationToggle = async (value) => {
    setProfileData((prev) => ({ ...prev, notifications: value }));
  };

  const getProfileImageSource = () => {
    if (selectedImage) return { uri: selectedImage };
    if (user?.profilePicture || user?.profileImage) {
      return { uri: user.profilePicture || user.profileImage };
    }
    return require('../../assets/Usuarionuevo.jpg');
  };

  return {
    profileData,
    editingField,
    selectedImage,
    isLoading,
    user,
    handleEditField,
    handleSaveField,
    pickImage,
    handleLogout,
    handleNotificationToggle,
    getProfileImageSource,
    setEditingField,
    setProfileData,
  };
};
