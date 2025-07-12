import { useState } from 'react';

const useRegistro = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función para registrar cliente
  const registerClient = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Crear FormData para enviar datos con imagen
      const form = new FormData();
      
      // Mapear los datos del formulario al formato que espera el backend
      form.append('firstName', formData.name.trim());
      form.append('lastName', formData.lastName.trim());
      form.append('email', formData.email.trim().toLowerCase());
      form.append('password', formData.password);
      form.append('phone', formData.phone.trim());
      
      // Si hay una imagen de perfil, agregarla
      if (formData.profilePhoto) {
        // Si es un archivo File
        if (formData.profilePhoto instanceof File) {
          form.append('profilePicture', formData.profilePhoto);
        }
        // Si es una imagen base64, convertirla a File
        else if (typeof formData.profilePhoto === 'string' && formData.profilePhoto.startsWith('data:')) {
          const response = await fetch(formData.profilePhoto);
          const blob = await response.blob();
          const file = new File([blob], 'profile.jpg', { type: blob.type });
          form.append('profilePicture', file);
        }
      }

      const response = await fetch('http://localhost:4000/api/registerClients', {
        method: 'POST',
        credentials: 'include', // Importante para las cookies
        body: form, // No agregar Content-Type, el navegador lo hace automáticamente
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar código de email
  const verifyEmailCode = async (verificationCode) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/registerClients/verifyCodeEmail', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la verificación');
      }

      return { success: true, data };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para reenviar código de verificación
  const resendVerificationCode = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/registerClients/resend-code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar código');
      }

      return { success: true, data };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => setError(null);

  // Función para resetear el estado
  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    registerClient,
    verifyEmailCode,
    resendVerificationCode,
    clearError,
    resetState,
  };
};

export default useRegistro;