// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl, buildAuthHeaders } from '../config/api';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const normalizeProfileUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
    return `${BACKEND_URL}/${url}`;
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('authToken');
      const savedBackendUrl = await AsyncStorage.getItem('lastBackendUrl');

      if (userData && token) {
        if (savedBackendUrl && savedBackendUrl !== BACKEND_URL) {
          setTimeout(() => {
            Alert.alert('Cambio de servidor', 'Se detectó cambio de backend. Inicia sesión de nuevo.');
          }, 300);
          await logout();
          return;
        }

        let parsedUser = JSON.parse(userData);
        try {
          const headers = await buildAuthHeaders();
          const meRes = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
            method: 'GET',
            headers,
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            parsedUser = {
              id: meData._id || meData.id || parsedUser?.id,
              email: meData.email || parsedUser?.email,
              firstName: meData.hasOwnProperty('firstName') ? (meData.firstName || '') : (parsedUser?.firstName || ''),
              lastName: meData.hasOwnProperty('lastName') ? (meData.lastName || '') : (parsedUser?.lastName || ''),
              phone: meData.hasOwnProperty('phone') ? (meData.phone || '') : (parsedUser?.phone || ''),
              profilePicture: normalizeProfileUrl(meData.profilePicture || parsedUser?.profilePicture || ''),
            };
            await AsyncStorage.setItem('userData', JSON.stringify(parsedUser));
            await AsyncStorage.setItem('lastBackendUrl', BACKEND_URL);
          } else {
            await logout();
            return;
          }
        } catch {
          // Si Render está lento, mantenemos cache
        }
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.log('Error al verificar sesión:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const loginUrl = buildApiUrl(API_ENDPOINTS.LOGIN);
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        await AsyncStorage.setItem('authToken', data.token);

        const headers = await buildAuthHeaders();
        const meRes = await fetch(buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME), {
          method: 'GET',
          headers,
        });

        let finalUser = data.user;
        if (meRes.ok) {
          const meData = await meRes.json();
          finalUser = {
            id: meData._id || meData.id || data.user?.id,
            email: meData.email || data.user?.email,
            firstName: meData.hasOwnProperty('firstName') ? (meData.firstName || '') : '',
            lastName: meData.hasOwnProperty('lastName') ? (meData.lastName || '') : '',
            phone: meData.hasOwnProperty('phone') ? (meData.phone || '') : '',
            profilePicture: normalizeProfileUrl(meData.profilePicture || ''),
          };
        }

        await AsyncStorage.setItem('userData', JSON.stringify(finalUser));
        await AsyncStorage.setItem('lastBackendUrl', BACKEND_URL);
        setUser(finalUser);
        setIsAuthenticated(true);
        return { success: true, user: finalUser, userType: data.userType };
      }
      return { success: false, error: data.message || 'Credenciales inválidas' };
    } catch (error) {
      if (String(error?.message || '').includes('Network')) {
        return { success: false, error: 'No se puede conectar al servidor.' };
      }
      return { success: false, error: 'Error de conexión al servidor' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('lastBackendUrl');
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.log('Error al cerrar sesión:', e);
    }
  };

  // Actualizar datos (PUT -> fallback PATCH) compatible con tu backend
  const updateUser = async (newData) => {
    try {
      console.log('[AuthContext] Actualizando usuario con datos:', newData);
      console.log('[AuthContext] Usuario actual antes de actualizar:', user);
      
      const headers = await buildAuthHeaders({ 'Content-Type': 'application/json' });
      const url = buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME);

      const make = (method) =>
        fetch(url, { method, headers, body: JSON.stringify(newData) });

      let res = await make('PUT');
      if (res.status === 405 || res.status === 404) res = await make('PATCH');

      console.log('[AuthContext] Respuesta del servidor:', res.status);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[AuthContext] Error del servidor:', err);
        return { success: false, error: err?.message || `HTTP ${res.status}` };
      }

      const resJson = await res.json().catch(() => null);
      console.log('[AuthContext] Datos recibidos del servidor:', resJson);
      
      const client = resJson?.client ?? resJson;

      const updatedUser = {
        id: client?._id || client?.id || user?.id,
        email: client?.email ?? user?.email,
        firstName: client?.hasOwnProperty('firstName') ? (client.firstName || '') : (user?.firstName || ''),
        lastName: client?.hasOwnProperty('lastName') ? (client.lastName || '') : (user?.lastName || ''),
        phone: client?.hasOwnProperty('phone') ? (client.phone || '') : (user?.phone || ''),
        profilePicture: normalizeProfileUrl(client?.profilePicture ?? user?.profilePicture ?? ''),
      };

      console.log('[AuthContext] Usuario actualizado:', updatedUser);

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('[AuthContext] Estado del usuario actualizado exitosamente');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('[AuthContext] Error al actualizar perfil:', error);
      return { success: false, error: error?.message || 'Error al actualizar perfil' };
    }
  };

  // Actualizar foto (multipart/form-data) – NO fijar Content-Type
  const updateProfileImage = async (imageUri) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.CUSTOMERS_ME);
      const auth = await buildAuthHeaders();

      const formData = new FormData();
      const ext = (imageUri?.split('.').pop() || 'jpg').toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
      const normalizedUri =
        imageUri?.startsWith('file://') || imageUri?.startsWith('content://')
          ? imageUri
          : `file://${imageUri}`;

      formData.append('profilePicture', { uri: normalizedUri, type: mime, name: `profile.${ext}` });

      const response = await fetch(url, {
        method: 'PUT',
        headers: auth, // Authorization + x-access-token
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return { success: false, error: err?.message || `HTTP ${response.status}` };
      }

      const data = await response.json().catch(() => null);
      const client = data?.client ?? data;
      const newUrl = normalizeProfileUrl(client?.profilePicture);
      const updatedUser = { ...user, profilePicture: newUrl || user?.profilePicture };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch {
      return { success: false, error: 'Error al actualizar foto' };
    }
  };

  // Cambiar contraseña (ruta de tu backend /api/profile/change-password)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const headers = await buildAuthHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
      const url = buildApiUrl(API_ENDPOINTS.PROFILE_CHANGE_PASSWORD);

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data?.message || `HTTP ${res.status}` };
      }
      return { success: true, message: data?.message || 'Contraseña actualizada correctamente' };
    } catch {
      return { success: false, error: 'Error de conexión. Verifica el servidor.' };
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
