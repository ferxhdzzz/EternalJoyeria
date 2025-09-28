import { useState } from 'react';

/**
 * Custom hook useRegistro para manejar el registro y verificación de clientes
 * Gestiona todo el flujo desde registro inicial hasta verificación por email
 */
const useRegistro = () => {
  // Estados para controlar el comportamiento del hook
  const [loading, setLoading] = useState(false);      // Indica si hay una operación en progreso
  const [error, setError] = useState(null);           // Almacena mensajes de error
  const [success, setSuccess] = useState(false);      // Indica si la última operación fue exitosa
  
  // Estado para manejar el token de verificación (solución al error de cookies cross-origin)
  const [verificationTokenData, setVerificationTokenData] = useState(null);

  /**
   * Función para registrar un nuevo cliente
   * Envía los datos del formulario al backend incluyendo imagen de perfil opcional
   */
  const registerClient = async (formData) => {
    // Resetear estados al iniciar nueva operación
    setLoading(true);
    setError(null);
    setSuccess(false);
    setVerificationTokenData(null); 

    try {
      // Validaciones (omito detalles por claridad)
      if (!formData.name?.trim() || !formData.lastName?.trim() || 
          !formData.email?.trim() || !formData.password || !formData.phone?.trim()) {
        throw new Error('Todos los campos son obligatorios');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Formato de email inválido');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Preparación de FormData (omito detalles por claridad)
      const form = new FormData();
      form.append('firstName', formData.name.trim());
      form.append('lastName', formData.lastName.trim());
      form.append('email', formData.email.trim().toLowerCase());
      form.append('password', formData.password);
      form.append('phone', formData.phone.trim());
      
      if (formData.profilePhoto) {
        if (formData.profilePhoto instanceof File) {
          form.append('profilePicture', formData.profilePhoto);
        }
        else if (typeof formData.profilePhoto === 'string' && formData.profilePhoto.startsWith('data:')) {
          const response = await fetch(formData.profilePhoto);
          const blob = await response.blob();
          const file = new File([blob], 'profile.jpg', { type: blob.type });
          form.append('profilePicture', file);
        }
      }

      // *** AQUÍ ESTÁ LA PETICIÓN HTTP para el Registro (POST) ***
      const response = await fetch('https://eternaljoyeria-cg5d.onrender.com/api/registerCustomers', {
        method: 'POST',
        credentials: 'include', // Importante: incluir cookies
        body: form,
      });

      // Parsear respuesta JSON del servidor
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Capturar el token de verificación (necesario para la siguiente etapa)
      if (data.verificationToken) {
        setVerificationTokenData(data.verificationToken);
        console.log("Token de verificación capturado del cuerpo de la respuesta.");
      }
      
      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      console.error('Error en registerClient:', err);
      const errorMessage = err.message || 'Error desconocido en el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para verificar el código de verificación enviado por email
   */
  const verifyEmailCode = async (verificationCode) => {
    // Activar loading y limpiar errores previos
    setLoading(true);
    setError(null);

    try {
      if (!verificationCode && verificationCode !== 0) {
        throw new Error('El código de verificación es requerido');
      }

      const codeStr = verificationCode.toString().trim();

      // Configurar los headers incluyendo el token capturado en el registro
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (verificationTokenData) {
        // Enviar el token como un encabezado Bearer 
        headers['Authorization'] = `Bearer ${verificationTokenData}`;
        console.log("Enviando token de verificación en el encabezado Authorization.");
      } else {
         console.warn("No se encontró token en estado. Confiando solo en cookies (puede fallar en cross-origin).");
      }

      // *** AQUÍ ESTÁ LA PETICIÓN HTTP para la Verificación (POST) ***
      const response = await fetch('https://eternaljoyeria-cg5d.onrender.com/api/registerCustomers/verifyCodeEmail', {
        method: 'POST',
        credentials: 'include', // Mantener para el caso de uso con cookies
        headers: headers, // Usar los headers con Authorization si está disponible
        body: JSON.stringify({ verificationCode: codeStr }),
      });

      // Parsear respuesta del servidor
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      setSuccess(true);
      setVerificationTokenData(null); 
      return { success: true, data };

    } catch (err) {
      console.error('Error en verifyEmailCode:', err);
      const errorMessage = err.message || 'Error desconocido en la verificación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para reenviar código de verificación
   */
  const resendVerificationCode = async (email) => {
    // Preparar estados para nueva operación
    setLoading(true);
    setError(null);
    setVerificationTokenData(null); // Limpiar el token anterior

    try {
      if (!email?.trim()) {
        throw new Error('El email es requerido');
      }

      const emailNormalized = email.trim().toLowerCase();
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailNormalized)) {
        throw new Error('Formato de email inválido');
      }

      // *** AQUÍ ESTÁ LA PETICIÓN HTTP para Reenviar Código (POST) ***
      const response = await fetch('https://eternaljoyeria-cg5d.onrender.com/api/registerCustomers/resend-code', {
        method: 'POST',
        credentials: 'include', // Mantener cookies para actualizar el token
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviar email para identificar al usuario
        body: JSON.stringify({ email: emailNormalized }),
      });

      // Procesar respuesta del servidor
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Capturar el nuevo token de la respuesta al reenviar el código
      if (data.verificationToken) {
          setVerificationTokenData(data.verificationToken);
          console.log("Nuevo token capturado tras reenvío.");
      }

      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      console.error('Error en resendVerificationCode:', err);
      const errorMessage = err.message || 'Error desconocido al reenviar código';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función utilitaria para limpiar mensajes de error
   */
  const clearError = () => setError(null);

  /**
   * Función para resetear completamente el estado del hook
   */
  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    // Limpiar el token al resetear el estado
    setVerificationTokenData(null);
  };

  // Retornar todas las funciones y estados para uso en componentes
  // NOTA IMPORTANTE: Este objeto contiene datos y funciones, NO debe ser renderizado directamente en JSX.
  return {
    // Estados del hook
    loading,      // boolean: indica si hay operación en progreso
    error,        // string|null: mensaje de error actual
    success,      // boolean: indica si última operación fue exitosa
    
    // Funciones principales
    registerClient,           // Función para registrar nuevo cliente
    verifyEmailCode,          // Función para verificar código de email
    resendVerificationCode,   // Función para reenviar código
    
    // Funciones utilitarias
    clearError,               // Limpiar errores
    resetState,               // Resetear todo el estado
  };
};

export default useRegistro;
