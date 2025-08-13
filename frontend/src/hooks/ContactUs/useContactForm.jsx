import { useState } from 'react';

const useContactForm = () => {
  // Estado unificado para todo el formulario
  const [state, setState] = useState({
    // Datos del formulario
    formData: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    // Estados de validación y envío
    errors: {},
    isSubmitting: false,
    submitSuccess: false,
    submitError: ''
  });

  // Función para actualizar cualquier parte del estado
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    updateState({
      formData: { ...state.formData, [name]: value },
      errors: { ...state.errors, [name]: '' },
      submitError: ''
    });
  };

  // Función de validación
  const validateForm = () => {
    const { formData } = state;
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
    
    // Validar teléfono (opcional)
    if (formData.phone.trim() && !/^[\+]?[\d\s\-\(\)]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Formato de teléfono inválido';
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
  };

  // Función principal para manejar el envío del formulario
  const handleSubmit = async (e, apiUrl = '/api/contactus/send') => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      updateState({ errors });
      return;
    }

    // Iniciar envío
    updateState({ 
      isSubmitting: true, 
      submitError: '', 
      errors: {} 
    });
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: state.formData.fullName.trim(),
          email: state.formData.email.trim().toLowerCase(),
          phone: state.formData.phone.trim(),
          subject: state.formData.subject.trim(),
          message: state.formData.message.trim()
        }),
      });

      // Verificar respuesta
      if (!response.ok) {
        let errorMessage = `Error del servidor (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error del servidor: ${response.statusText || response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Parsear respuesta
      const text = await response.text();
      if (!text) throw new Error('Respuesta vacía del servidor');
      
      try {
        JSON.parse(text);
      } catch {
        throw new Error('Respuesta inválida del servidor');
      }

      // Éxito - resetear formulario y mostrar mensaje
      updateState({
        formData: {
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        },
        submitSuccess: true,
        isSubmitting: false
      });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        updateState({ submitSuccess: false });
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      let errorMessage = 'Error al enviar el mensaje. Por favor intenta nuevamente.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio no encontrado. Por favor contacta al administrador.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      updateState({ 
        submitError: errorMessage,
        isSubmitting: false 
      });
    }
  };

  // Función para resetear todo
  const resetForm = () => {
    setState({
      formData: {
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      submitSuccess: false,
      submitError: ''
    });
  };

  // Función para limpiar mensajes
  const clearMessages = () => {
    updateState({ 
      submitSuccess: false, 
      submitError: '' 
    });
  };

  // Estado computado para validación
  const isFormValid = Object.keys(validateForm()).length === 0 && 
                     state.formData.fullName.trim() && 
                     state.formData.email.trim() && 
                     state.formData.subject.trim() && 
                     state.formData.message.trim();

  return {
    // Estados
    formData: state.formData,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    submitSuccess: state.submitSuccess,
    submitError: state.submitError,
    isFormValid,
    
    // Funciones
    handleChange,
    handleSubmit,
    resetForm,
    clearMessages,
    validateForm
  };
};

export default useContactForm;