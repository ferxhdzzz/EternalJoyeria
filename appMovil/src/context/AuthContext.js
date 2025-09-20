import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // URL del backend viene de la configuración centralizada

  // Asegura que profilePicture sea una URL absoluta
  const normalizeProfileUrl = (url) => {
    if (!url) return '';
    // Ya absoluta
    if (/^https?:\/\//i.test(url)) return url;
    // Evitar doble slash
    if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
    return `${BACKEND_URL}/${url}`;
  };

  // Verificar si hay un usuario guardado al iniciar la app
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('authToken');
      
      if (userData && token) {
        // Intentar refrescar datos desde el backend
        let parsedUser = JSON.parse(userData);
        try {
          const meRes = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            const refreshedUser = {
              id: meData._id || meData.id || parsedUser?.id,
              email: meData.email || parsedUser?.email,
              firstName: meData.firstName || parsedUser?.firstName || '',
              lastName: meData.lastName || parsedUser?.lastName || '',
              phone: meData.phone || parsedUser?.phone || '',
              profilePicture: normalizeProfileUrl(meData.profilePicture || parsedUser?.profilePicture || ''),
            };
            parsedUser = refreshedUser;
            await AsyncStorage.setItem('userData', JSON.stringify(refreshedUser));
          }
        } catch (e) {
          // si falla, seguimos con el cache
        }
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error al verificar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función de login que se conecta al backend
  const login = async (email, password) => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar token
        await AsyncStorage.setItem('authToken', data.token);

        // Obtener perfil completo del usuario autenticado
        const meRes = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        let finalUser = data.user;
        if (meRes.ok) {
          const meData = await meRes.json();
          // meData puede ser el documento completo del cliente
          finalUser = {
            id: meData._id || meData.id || data.user.id,
            email: meData.email || data.user.email,
            firstName: meData.firstName || '',
            lastName: meData.lastName || '',
            phone: meData.phone || '',
            profilePicture: normalizeProfileUrl(meData.profilePicture || ''),
          };
        }

        // Guardar usuario normalizado
        await AsyncStorage.setItem('userData', JSON.stringify(finalUser));

        // Actualizar estado
        setUser(finalUser);
        setIsAuthenticated(true);

        return { success: true, user: finalUser, userType: data.userType };
      } else {
        return { success: false, error: data.message || 'Credenciales inválidas' };
      }
    } catch (error) {
      console.log('Error en login:', error);
      return { success: false, error: 'Error de conexión al servidor' };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (newData) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        // El backend retorna { client: updatedCustomer }
        const resJson = await response.json().catch(() => null);
        const client = resJson?.client;
        const updatedUser = client ? {
          id: client._id || user?.id,
          email: client.email ?? user?.email,
          firstName: client.firstName ?? user?.firstName ?? '',
          lastName: client.lastName ?? user?.lastName ?? '',
          phone: client.phone ?? user?.phone ?? '',
          profilePicture: normalizeProfileUrl(client.profilePicture ?? user?.profilePicture ?? ''),
        } : { ...user, ...newData };
        
        // Actualizar en AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Actualizar estado
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: 'Error al actualizar perfil' };
      }
    } catch (error) {
      console.log('Error al actualizar usuario:', error);
      return { success: false, error: 'Error al actualizar usuario' };
    }
  };

  // Función para actualizar foto de perfil
  const updateProfileImage = async (imageUri) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      // Crear FormData para la imagen
      const formData = new FormData();
      // Intentar inferir extensión y mime
      const uriParts = (imageUri || '').split('.')
      const ext = uriParts.length > 1 ? uriParts.pop().toLowerCase() : 'jpg';
      const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
      // Normalizar URI (Android puede usar content://)
      const normalizedUri = imageUri?.startsWith('file://') || imageUri?.startsWith('content://')
        ? imageUri
        : `file://${imageUri}`;
      formData.append('profilePicture', {
        uri: normalizedUri,
        type: mime,
        name: `profile.${ext}`,
      });

      const response = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const client = data?.client;
        const newUrl = normalizeProfileUrl(client?.profilePicture);
        const updatedUser = { ...user, profilePicture: newUrl || user?.profilePicture };
        
        // Actualizar en AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Actualizar estado
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        const err = await response.json().catch(() => ({}));
        return { success: false, error: err?.message || 'Error al actualizar foto' };
      }
    } catch (error) {
      console.log('Error al actualizar foto:', error);
      return { success: false, error: 'Error al actualizar foto' };
    }
  };

  // Función para cambiar la contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      console.log('🔐 [Frontend] Iniciando cambio de contraseña...');
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('❌ [Frontend] No se encontró token');
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('🔐 [Frontend] Token encontrado:', token.substring(0, 50) + '...');
      
      // Probemos primero con una solicitud simple para verificar conectividad
      const testUrl = buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME);
      console.log('🔐 [Frontend] Probando conectividad con:', testUrl);
      
      try {
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('🔐 [Frontend] Test de conectividad:', testResponse.status);
      } catch (testError) {
        console.log('❌ [Frontend] Error de conectividad:', testError);
        throw new Error('No se puede conectar al servidor. Verifica tu conexión.');
      }

      const changePasswordUrl = buildApiUrl(API_ENDPOINTS.PROFILE_CHANGE_PASSWORD);
      console.log('🔐 [Frontend] Enviando solicitud a:', changePasswordUrl);
      console.log('🔐 [Frontend] Datos enviados:', {
        currentPassword: '***',
        newPassword: '***'
      });
      
      const response = await fetch(changePasswordUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      console.log('🔐 [Frontend] Respuesta del servidor:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('🔐 [Frontend] Datos de respuesta:', data);

      if (!response.ok) {
        console.log('❌ [Frontend] Error en respuesta:', data);
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      console.log('✅ [Frontend] Contraseña cambiada exitosamente');
      return { success: true, message: data.message || 'Contraseña actualizada correctamente' };
    } catch (error) {
      console.error('❌ [Frontend] Error al cambiar la contraseña:', error);
      
      // Si es un error de red, devolver un mensaje más específico
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Error de conexión. Verifica que el servidor esté funcionando y tu conexión a internet.'
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Error al cambiar la contraseña. Inténtalo de nuevo.'
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    updateProfileImage,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};