import { useState, useEffect } from 'react';
import { API_URL } from '../config/backend';

export const useProfile = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para probar la conexión básica
  const testConnection = async () => {
    try {
      console.log('🔍 Probando conexión básica...');
      const response = await fetch(`${API_URL}/test`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conexión básica exitosa:', data);
        return true;
      }
    } catch (err) {
      console.log('❌ Error en conexión básica:', err);
      return false;
    }
  };

  // Función para obtener el perfil del usuario
  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 Intentando obtener perfil para usuario:', userId);
      console.log('📍 URL:', `${API_URL}/customers/${userId}`);
      
      // Primero probar conexión básica
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('No se puede conectar con el backend');
      }

      const response = await fetch(`${API_URL}/customers/${userId}`);
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado - necesitas estar logueado');
        } else if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        } else {
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Perfil obtenido exitosamente:', data);
      setUser(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error obteniendo perfil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async (updateData) => {
    try {
      setLoading(true);
      console.log('📝 Actualizando perfil con datos:', updateData);
      
      const response = await fetch(`${API_URL}/customers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Perfil actualizado:', data);
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

  // Función para actualizar la foto de perfil
  const updateProfilePicture = async (file) => {
    try {
      setLoading(true);
      console.log('📸 Subiendo foto de perfil...');
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_URL}/customers/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir foto: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Foto subida exitosamente:', data);
      setUser(data.client);
      setError(null);
      return { success: true, data: data.client };
    } catch (err) {
      console.error('❌ Error subiendo foto:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cargar el perfil cuando se monta el componente
  useEffect(() => {
    if (userId) {
      console.log('🚀 Iniciando carga del perfil...');
      fetchProfile();
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfilePicture,
    testConnection,
  };
}; 