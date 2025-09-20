import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../../config/api';

/**
 * Custom hook useRegistro para React Native
 * Maneja el registro y verificación de clientes en aplicaciones móviles
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
   * @param {string} formData.firstName - Nombre del cliente
   * @param {string} formData.lastName - Apellido del cliente
   * @param {string} formData.email - Email del cliente
   * @param {string} formData.password - Contraseña del cliente
   * @param {string} formData.phone - Teléfono del cliente
   * @param {string} formData.profilePhoto - Foto de perfil (URI o base64)
   * @returns {Promise<Object>} Resultado de la operación con success y data/error
   */
  const registerClient = async (formData) => {
    // Resetear estados al iniciar nueva operación
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validaciones básicas del lado del cliente
      if (!formData.firstName?.trim() || !formData.lastName?.trim() || 
          !formData.email?.trim() || !formData.password || !formData.phone?.trim()) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Formato de email inválido');
      }

      // Validación básica de contraseña
      if (formData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Validar que contenga carácter especial
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        throw new Error('La contraseña debe contener al menos un carácter especial');
      }

      // Validación del teléfono
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^[0-9]{8,10}$/;
      if (!phoneRegex.test(cleanPhone)) {
        throw new Error('El teléfono debe tener entre 8 y 10 dígitos');
      }

      // Crear FormData para enviar datos multipart (necesario para archivos)
      const form = new FormData();
      
      // Mapear los datos del formulario al formato que espera el backend
      form.append('firstName', formData.firstName.trim());
      form.append('lastName', formData.lastName.trim());
      // Normalizar email a minúsculas para consistencia
      form.append('email', formData.email.trim().toLowerCase());
      form.append('password', formData.password);
      form.append('phone', cleanPhone);
      
      // Manejar la imagen de perfil si existe
      if (formData.profilePhoto) {
        // En React Native, las imágenes suelen venir como URI
        if (typeof formData.profilePhoto === 'string') {
          // Si es una URI local de la imagen seleccionada
          if (formData.profilePhoto.startsWith('file://') || 
              formData.profilePhoto.startsWith('content://') ||
              formData.profilePhoto.startsWith('/')) {
            form.append('profilePicture', {
              uri: formData.profilePhoto,
              type: 'image/jpeg',
              name: 'profile.jpg',
            });
          }
          // Si es base64
          else if (formData.profilePhoto.startsWith('data:image')) {
            form.append('profilePicture', {
              uri: formData.profilePhoto,
              type: 'image/jpeg',
              name: 'profile.jpg',
            });
          }
        }
      }

      // Hacer la petición al backend usando configuración centralizada
      const response = await fetch(buildApiUrl(API_ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      // Guardar el token de verificación si viene en la respuesta
      if (data.verificationToken) {
        await AsyncStorage.setItem('verificationToken', data.verificationToken);
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
   * 
   * @param {string|number} verificationCode - Código ingresado por el usuario
   * @param {string} email - Email del usuario para verificación
   * @returns {Promise<Object>} Resultado de la verificación con success y data/error
   */
  const verifyEmailCode = async (verificationCode, email) => {
    // Activar loading y limpiar errores previos
    setLoading(true);
    setError(null);

    try {
      // Validación básica - solo verificar que se proporcionó algo
      if (!verificationCode && verificationCode !== 0) {
        throw new Error('El código de verificación es requerido');
      }

      if (!email?.trim()) {
        throw new Error('El email es requerido');
      }

      // Convertir a string y limpiar espacios
      const codeStr = verificationCode.toString().trim();
      const emailNormalized = email.trim().toLowerCase();

      // Realizar petición al endpoint de verificación usando configuración centralizada
      const response = await fetch(buildApiUrl(API_ENDPOINTS.VERIFY_EMAIL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          verificationCode: codeStr,
          email: emailNormalized 
        }),
      });

      // Parsear respuesta del servidor
      const data = await response.json();

      // Si hay error en la verificación, lanzar excepción
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Verificación exitosa
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

      // Petición para generar y enviar nuevo código usando configuración centralizada
      const response = await fetch(buildApiUrl(API_ENDPOINTS.RESEND_CODE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
   * Función para validar datos del formulario
   * @param {Object} formData - Datos a validar
   * @returns {Object} Objeto con errores encontrados
   */
  const validateFormData = (formData) => {
    const errors = {};

    // Validar nombre
    if (!formData.firstName?.trim()) {
      errors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.lastName?.trim()) {
      errors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }


    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Ingresa un correo válido';
    }

    // Validar teléfono
    if (!formData.phone?.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^[0-9]{8,10}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Ingresa un teléfono válido (8-10 dígitos)';
      }
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = 'La contraseña debe contener al menos un carácter especial';
    }

    return errors;
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
    validateFormData,         // Función para validar datos del formulario
    
    // Funciones utilitarias
    clearError,               // Limpiar errores
    resetState,               // Resetear todo el estado
  };
};

export default useRegistro;