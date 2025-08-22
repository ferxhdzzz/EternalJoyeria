import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import { useAuth } from '../context/AuthContext'; // Ajusta esta ruta según tu estructura de archivos

export const useProfile = (navigation) => {
  // Descomenta y ajusta la ruta del import de useAuth según tu estructura de archivos
  // const { user, updateUser, updateProfileImage, logout } = useAuth();
  
  // Mock data para desarrollo - reemplaza con useAuth real
  const user = {
    firstName: 'Jennifer',
    lastName: 'Teos',
    email: 't22jenn@gmail.com',
    phone: '71042228',
    profileImage: null,
    language: 'Español',
    currency: 'USD',
    notifications: true
  };
  
  // Mock functions - reemplaza con las funciones reales de useAuth
  const updateUser = async (data) => {
    console.log('Mock updateUser:', data);
    return { success: true };
  };
  
  const updateProfileImage = async (imageUri) => {
    console.log('Mock updateProfileImage:', imageUri);
    return { success: true };
  };
  
  const logout = async () => {
    console.log('Mock logout');
    return { success: true };
  };
  
  const [profileData, setProfileData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '**********',
    language: user?.language || 'Español',
    currency: user?.currency || 'USD',
    notifications: user?.notifications !== undefined ? user.notifications : true,
  });

  const [editingField, setEditingField] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar profileData cuando el user cambie
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.firstName ? `${user.firstName} ${user.lastName}` : '',
        email: user.email || '',
        phone: user.phone || '',
        password: '**********',
        language: user.language || 'Español',
        currency: user.currency || 'USD',
        notifications: user.notifications !== undefined ? user.notifications : true,
      });
    }
  }, [user]);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = async (field, value) => {
    if (!value || value.trim() === '') {
      setEditingField(null);
      return;
    }

    setIsLoading(true);
    try {
      let updateData = {};
      
      if (field === 'name') {
        const nameParts = value.trim().split(' ');
        updateData.firstName = nameParts[0] || '';
        updateData.lastName = nameParts.slice(1).join(' ') || '';
      } else if (field === 'phone') {
        updateData.phone = value.trim();
      } else if (field === 'email') {
        updateData.email = value.trim();
      } else if (field === 'password') {
        if (value.length < 6) {
          Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
          setEditingField(null);
          setIsLoading(false);
          return;
        }
        updateData.password = value;
      }

      if (Object.keys(updateData).length > 0) {
        const result = await updateUser(updateData);
        if (result.success) {
          setProfileData(prev => ({ ...prev, [field]: value }));
          Alert.alert('Éxito', 'Campo actualizado correctamente');
        } else {
          Alert.alert('Error', result.message || 'No se pudo actualizar el campo');
        }
      }
    } catch (error) {
      console.error('Error actualizando campo:', error);
      Alert.alert('Error', 'Error al actualizar el campo');
    } finally {
      setIsLoading(false);
      setEditingField(null);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      // Verificar permisos existentes primero
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      // Si no hay permisos, solicitarlos
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = newStatus;
        
        if (status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Necesitamos acceso a tu galería para cambiar la foto de perfil.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Ir a Configuración', 
                onPress: () => {
                  Alert.alert(
                    'Instrucciones',
                    '1. Ve a Configuración\n2. Busca la aplicación\n3. Activa "Fotos"\n4. Regresa a la app',
                    [{ text: 'Entendido' }]
                  );
                }
              }
            ]
          );
          setIsLoading(false);
          return;
        }
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        // Actualizar la imagen en el contexto
        const updateResult = await updateProfileImage(imageUri);
        if (updateResult.success) {
          Alert.alert(
            'Éxito',
            'Foto de perfil actualizada correctamente'
          );
        } else {
          Alert.alert('Error', updateResult.message || 'No se pudo actualizar la foto');
          setSelectedImage(null); // Revertir si falló
        }
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert(
        'Error',
        'No se pudo seleccionar la imagen. Inténtalo de nuevo.'
      );
      setSelectedImage(null);
    } finally {
      setIsLoading(false);
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
            setIsLoading(true);
            try {
              const result = await logout();
              if (result.success) {
                // Navegar a la pantalla de login
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                Alert.alert('Error', result.message || 'No se pudo cerrar sesión');
              }
            } catch (error) {
              console.error('Error cerrando sesión:', error);
              Alert.alert('Error', 'Error al cerrar sesión');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleNotificationToggle = async (value) => {
    setIsLoading(true);
    try {
      const result = await updateUser({ notifications: value });
      if (result.success) {
        setProfileData(prev => ({ ...prev, notifications: value }));
      } else {
        Alert.alert('Error', 'No se pudo actualizar la configuración de notificaciones');
        // Revertir el cambio
        setProfileData(prev => ({ ...prev, notifications: !value }));
      }
    } catch (error) {
      console.error('Error actualizando notificaciones:', error);
      Alert.alert('Error', 'Error al actualizar notificaciones');
      setProfileData(prev => ({ ...prev, notifications: !value }));
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileImageSource = () => {
    if (selectedImage) {
      return { uri: selectedImage };
    }
    if (user?.profileImage || user?.profilePicture) {
      return { uri: user.profileImage || user.profilePicture };
    }
    return require('../../assets/Usuarionuevo.jpg');
  };

  return {
    // Estado
    profileData,
    editingField,
    selectedImage,
    isLoading,
    user,
    
    // Funciones
    handleEditField,
    handleSaveField,
    pickImage,
    handleLogout,
    handleNotificationToggle,
    getProfileImageSource,
    
    // Setters para casos especiales
    setEditingField,
    setProfileData,
  };
};