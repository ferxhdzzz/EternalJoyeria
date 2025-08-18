import { useState, useEffect } from 'react';
import { API_URL } from '../config/backend';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para renovar token
  const refreshToken = async () => {
    try {
      console.log('🔄 Intentando renovar token...');
      const response = await fetch(`${API_URL}/customers/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Incluir cookies
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token renovado exitosamente');
        return { success: true, user: data.user };
      } else {
        console.log('❌ No se pudo renovar el token');
        return { success: false };
      }
    } catch (err) {
      console.error('❌ Error renovando token:', err);
      return { success: false };
    }
  };

  // Función para obtener el perfil del usuario autenticado
  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 Intentando obtener perfil del usuario autenticado...');
      
      const response = await fetch(`${API_URL}/customers/me`, {
        credentials: 'include', // Incluir cookies
      });
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (response.status === 401) {
        // Token expirado, intentar renovar
        console.log('🔄 Token expirado, intentando renovar...');
        const refreshResult = await refreshToken();
        
        if (refreshResult.success) {
          // Token renovado, intentar obtener perfil nuevamente
          const retryResponse = await fetch(`${API_URL}/customers/me`, {
            credentials: 'include',
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('✅ Perfil obtenido después de renovar token:', data);
            setUser(data);
            setError(null);
            return;
          }
        }
        
        // Si no se pudo renovar, redirigir al login
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        } else {
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Perfil obtenido exitosamente:', data);
      console.log('📸 Foto de perfil del usuario:', data.profilePicture);
      setUser(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error obteniendo perfil:', err);
      setError(err.message);
      
      // Si es error de sesión, redirigir al login
      if (err.message.includes('Sesión expirada') || err.message.includes('No autorizado')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el perfil del usuario autenticado
  const updateProfile = async (updateData) => {
    try {
      setLoading(true);
      console.log('📝 Actualizando perfil del usuario autenticado con datos:', updateData);
      
      // Usar la ruta /me para actualizar el usuario autenticado
      const response = await fetch(`${API_URL}/customers/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });

      if (response.status === 401) {
        // Token expirado, intentar renovar
        const refreshResult = await refreshToken();
        if (refreshResult.success) {
          // Reintentar la actualización
          const retryResponse = await fetch(`${API_URL}/customers/me`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include',
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data.client);
            setError(null);
            return { success: true, data: data.client };
          }
        }
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error(`Error al actualizar: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Perfil actualizado exitosamente:', data);
      setUser(data.client);
      setError(null);
      return { success: true, data: data.client };
    } catch (err) {
      console.error('❌ Error actualizando perfil:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la foto de perfil del usuario autenticado
  const updateProfilePicture = async (file) => {
    try {
      setLoading(true);
      console.log('📸 Subiendo foto de perfil del usuario autenticado...');
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Usar la ruta /me para actualizar la foto del usuario autenticado
      const response = await fetch(`${API_URL}/customers/me`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) {
        // Token expirado, intentar renovar
        const refreshResult = await refreshToken();
        if (refreshResult.success) {
          // Reintentar la subida
          const retryResponse = await fetch(`${API_URL}/customers/me`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data.client);
            setError(null);
            return { success: true, data: data.client };
          }
        }
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error(`Error al subir foto: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Foto de perfil subida exitosamente:', data);
      setUser(data.client);
      setError(null);
      return { success: true, data: data.client };
    } catch (err) {
      console.error('❌ Error subiendo foto de perfil:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cargar el perfil cuando se monta el componente
  useEffect(() => {
    console.log('🚀 Iniciando carga del perfil del usuario autenticado...');
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfilePicture,
    refreshToken,
  };
}; 