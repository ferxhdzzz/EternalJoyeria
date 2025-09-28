import { useState } from 'react';

/**
 * Custom hook useRegistro para manejar el registro y verificación de clientes
 * Gestiona todo el flujo desde registro inicial hasta verificación por email
 */
const useRegistro = () => {
  // Estados para controlar el comportamiento del hook
  const [loading, setLoading] = useState(false);     // Indica si hay una operación en progreso
  const [error, setError] = useState(null);          // Almacena mensajes de error
  const [success, setSuccess] = useState(false);     // Indica si la última operación fue exitosa

  /**
   * Función para registrar un nuevo cliente
   * Envía los datos del formulario al backend incluyendo imagen de perfil opcional
   * 
   * @param {Object} formData - Datos del formulario de registro
   * @param {string} formData.name - Nombre del cliente
   * @param {string} formData.lastName - Apellido del cliente
   * @param {string} formData.email - Email del cliente
   * @param {string} formData.password - Contraseña del cliente
   * @param {string} formData.phone - Teléfono del cliente
   * @param {File|string} formData.profilePhoto - Foto de perfil (File o base64)
   * @returns {Promise<Object>} Resultado de la operación con success y data/error
   */
  const registerClient = async (formData) => {
    // Resetear estados al iniciar nueva operación
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validaciones básicas del lado del cliente
      if (!formData.name?.trim() || !formData.lastName?.trim() || 
          !formData.email?.trim() || !formData.password || !formData.phone?.trim()) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Formato de email inválido');
      }

      // Validación básica de contraseña
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear FormData para enviar datos multipart (necesario para archivos)
      const form = new FormData();
      
      // Mapear y limpiar los datos del formulario al formato que espera el backend
      // El backend espera 'firstName' pero el form envía 'name'
      form.append('firstName', formData.name.trim());
      form.append('lastName', formData.lastName.trim());
      // Normalizar email a minúsculas para consistencia
      form.append('email', formData.email.trim().toLowerCase());
      form.append('password', formData.password);
      form.append('phone', formData.phone.trim());
      
      // Manejar la imagen de perfil si existe
      if (formData.profilePhoto) {
        // Caso 1: Si ya es un archivo File (desde input file)
        if (formData.profilePhoto instanceof File) {
          form.append('profilePicture', formData.profilePhoto);
        }
        // Caso 2: Si es una imagen en formato base64 (desde canvas, cámara, etc)
        else if (typeof formData.profilePhoto === 'string' && formData.profilePhoto.startsWith('data:')) {
          try {
            // Convertir base64 a Blob y luego a File
            const response = await fetch(formData.profilePhoto);
            const blob = await response.blob();
            const file = new File([blob], 'profile.jpg', { type: blob.type });
            form.append('profilePicture', file);
          } catch (conversionError) {
            console.warn('Error al convertir imagen base64:', conversionError);
            // Continuar sin imagen en lugar de fallar completamente
          }
        }
      }

      // Realizar petición HTTP al endpoint de registro
      const response = await fetch('https://eternaljoyeria-cg5d.onrender.com/api/registerCustomers', {
        method: 'POST',
        credentials: 'include', // Importante: incluir cookies para que el token se guarde
        body: form, // Enviar FormData (NO agregar Content-Type, el navegador lo hace automáticamente)
      });

      // Parsear respuesta JSON del servidor
      const data = await response.json();

      // Si la respuesta no es exitosa, lanzar error con el mensaje del servidor
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Si llegamos aquí, el registro fue exitoso
      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      // Capturar cualquier error y guardarlo en el estado
      console.error('Error en registerClient:', err);
      const errorMessage = err.message || 'Error desconocido en el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      // Siempre desactivar loading al finalizar (exitoso o no)
      setLoading(false);
    }
  };

  /**
   * Función para verificar el código de verificación enviado por email
   * Utiliza el token JWT guardado en cookies para validar el código
   * 
   * @param {string|number} verificationCode - Código ingresado por el usuario
   * @returns {Promise<Object>} Resultado de la verificación con success y data/error
   */
  const verifyEmailCode = async (verificationCode) => {
    // Activar loading y limpiar errores previos
    setLoading(true);
    setError(null);

    try {
      // Validación básica - solo verificar que se proporcionó algo
      if (!verificationCode && verificationCode !== 0) {
        throw new Error('El código de verificación es requerido');
      }

      // Convertir a string y limpiar espacios (el backend valida el formato)
      const codeStr = verificationCode.toString().trim();

      // Realizar petición al endpoint de verificación
      const response = await fetch('https://eternaljoyeria-cg5d.onrender.com/api/registerCustomers/verifyCodeEmail', {
        method: 'POST',
        credentials: 'include', // Incluir cookies (necesario para el token de verificación)
        headers: {
          'Content-Type': 'application/json',
        },
        // Solo enviamos el código, el email se obtiene del token JWT en el backend
        // El backend se encarga de validar el formato y comparar con el código generado
        body: JSON.stringify({ verificationCode: codeStr }),
      });

      // Parsear respuesta del servidor
      const data = await response.json();

      // Si hay error en la verificación, lanzar excepción
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Verificación exitosa - el usuario ya está verificado
      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      // Guardar error en el estado para mostrarlo en la UI
      console.error('Error en verifyEmailCode:', err);
      const errorMessage = err.message || 'Error desconocido en la verificación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      // Desactivar loading sin importar el resultado
      setLoading(false);
    }
  };

  /**
   * Función para reenviar código de verificación
   * Útil cuando el código expira o el usuario no lo recibió
   * 
   * @param {string} email - Email del usuario que necesita nuevo código
   * @returns {Promise<Object>} Resultado del reenvío con success y data/error
   */
  const resendVerificationCode = async (email) => {
    // Preparar estados para nueva operación
    setLoading(true);
    setError(null);

    try {
      // Validar email
      if (!email?.trim()) {
        throw new Error('El email es requerido');
      }

      const emailNormalized = email.trim().toLowerCase();
      
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailNormalized)) {
        throw new Error('Formato de email inválido');
      }

      // Petición para generar y enviar nuevo código
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

      // Verificar si hubo errores en el servidor
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Código reenviado exitosamente
      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      // Manejar errores y mostrarlos al usuario
      console.error('Error en resendVerificationCode:', err);
      const errorMessage = err.message || 'Error desconocido al reenviar código';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      // Finalizar loading independientemente del resultado
      setLoading(false);
    }
  };

  /**
   * Función utilitaria para limpiar mensajes de error
   * Útil para resetear errores después de mostrarlos al usuario
   */
  const clearError = () => setError(null);

  /**
   * Función para resetear completamente el estado del hook
   * Útil cuando se navega a otra página o se reinicia el proceso
   */
  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  // Retornar todas las funciones y estados para uso en componentes
  return {
    // Estados del hook
    loading,      // boolean: indica si hay operación en progreso
    error,        // string|null: mensaje de error actual
    success,      // boolean: indica si última operación fue exitosa
    
    // Funciones principales
    registerClient,           // Función para registrar nuevo cliente
    verifyEmailCode,          // Función para verificar código de email
    resendVerificationCode,   // Función para reenviar código
    
    // Funciones utilitarias
    clearError,               // Limpiar errores
    resetState,               // Resetear todo el estado
  };
};

export default useRegistro;