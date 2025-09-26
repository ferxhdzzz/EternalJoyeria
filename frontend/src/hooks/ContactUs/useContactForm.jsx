import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook useContactForm para manejar el formulario de contacto
 * Gestiona validaciones, envío y estados del formulario
 */
const useContactForm = () => {
  // Estados para controlar el comportamiento del hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Estado unificado para los datos del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Estados de validación por campo
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Función para manejar cambios en los inputs del formulario
   * Actualiza el estado y limpia errores relacionados
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Actualizar datos del formulario
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo específico si existe
    setFieldErrors(prev => {
      if (prev[name]) {
        const { [name]: removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
    
    // Limpiar error general si existe
    if (error) {
      setError(null);
    }
  }, [error]);

  /**
   * Función de validación del formulario
   */
  const validateForm = useCallback(() => {
    const errors = {};
    
    // Validar nombre completo
    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre completo es obligatorio';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = 'El nombre es demasiado largo (máximo 100 caracteres)';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'El formato del email no es válido';
    }
    
    // Validar teléfono (opcional, pero si se proporciona debe ser válido)
    if (formData.phone.trim()) {
      // Regex mejorado para teléfonos salvadoreños e internacionales
      const phoneRegex = /^(\+503\s?)?[2-7]\d{3}-?\d{4}$|^(\+\d{1,3}\s?)?[\d\s\-\(\)]{8,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = 'Formato de teléfono inválido (ej: +503 1234-5678)';
      }
    }
    
    // Validar asunto
    if (!formData.subject.trim()) {
      errors.subject = 'El asunto es obligatorio';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'El asunto debe tener al menos 3 caracteres';
    } else if (formData.subject.trim().length > 200) {
      errors.subject = 'El asunto es demasiado largo (máximo 200 caracteres)';
    }
    
    // Validar mensaje
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'El mensaje es demasiado largo (máximo 2000 caracteres)';
    }
    
    return errors;
  }, [formData]);

  /**
   * Función principal para enviar el mensaje de contacto
   */
  const apiUrl = 'http://localhost:4000/api/contactus/send'
  const sendContactMessage = useCallback(async (e) => {
    // Prevenir comportamiento por defecto del formulario
    if (e?.preventDefault) {
      e.preventDefault();
    }

    // Evitar envíos múltiples si ya está en progreso
    if (loading) return { success: false, error: 'Envío en progreso...' };

    // Resetear estados al iniciar nueva operación
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      // Validar formulario del lado del cliente
      const errors = validateForm();
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error('Por favor corrige los errores en el formulario');
      }

      // Preparar datos limpios para enviar
      const cleanData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      // Realizar petición HTTP con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parsear respuesta JSON del servidor
      const data = await response.json();

      // Si la respuesta no es exitosa, lanzar error con el mensaje del servidor
      if (!response.ok) {
        // Manejar errores específicos del servidor
        if (response.status === 429) {
          throw new Error('Demasiadas solicitudes. Por favor espera antes de intentar de nuevo.');
        }
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Si llegamos aquí, el envío fue exitoso
      setSuccess(true);
      
      // Resetear formulario después del envío exitoso
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return { success: true, data };

    } catch (err) {
      console.error('Error en sendContactMessage:', err);
      let errorMessage = err.message || 'Error desconocido al enviar el mensaje';
      
      // Personalizar mensajes de error según el tipo
      if (err.name === 'AbortError') {
        errorMessage = 'La solicitud tardó demasiado. Por favor intenta de nuevo.';
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Servicio no encontrado. Por favor contacta al administrador.';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  }, [formData, loading, validateForm]);

  /**
   * Función utilitaria para limpiar mensajes de error y éxito
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  /**
   * Función utilitaria para limpiar solo errores
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Función para resetear completamente el formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setFieldErrors({});
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  /**
   * Estado computado para saber si el formulario es válido
   */
  const isFormValid = useMemo(() => {
    return Object.keys(validateForm()).length === 0 && 
           formData.fullName.trim() && 
           formData.email.trim() && 
           formData.subject.trim() && 
           formData.message.trim();
  }, [validateForm, formData]);

  // Retornar todas las funciones y estados para uso en componentes
  return {
    // Estados del formulario
    formData,
    fieldErrors,
    loading,
    error,
    success,
    isFormValid,
    
    // Funciones principales
    handleChange,
    sendContactMessage,
    
    // Funciones utilitarias
    validateForm,
    clearMessages,
    clearError,
    resetForm,
    
    // Aliases para compatibilidad con el código existente
    isSubmitting: loading,
    submitError: error,
    submitSuccess: success,
    handleSubmit: sendContactMessage,
    errors: fieldErrors
  };
};
//new

export default useContactForm;