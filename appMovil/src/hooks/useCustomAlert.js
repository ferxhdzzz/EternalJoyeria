import { useState, useCallback } from 'react';

const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    autoClose: false,
    autoCloseDelay: 3000,
    showIcon: true,
    animationType: 'bounce',
  });

  const showAlert = useCallback(({
    type = 'info',
    title,
    message,
    buttons = [],
    autoClose = false,
    autoCloseDelay = 3000,
    showIcon = true,
    animationType = 'bounce',
  }) => {
    console.log('showAlert llamado con:', { type, title, message, buttons, autoClose });
    console.log('Estado actual de alertConfig:', alertConfig);
    
    // Actualizacion directa sin setTimeout
    const newConfig = {
      visible: true,
      type,
      title,
      message,
      buttons,
      autoClose,
      autoCloseDelay,
      showIcon,
      animationType,
    };
    
    console.log('Nuevo config:', newConfig);
    setAlertConfig(newConfig);
    console.log('setAlertConfig ejecutado');
  }, [alertConfig]);

  const hideAlert = useCallback(() => {
    setTimeout(() => {
      setAlertConfig(prev => ({ ...prev, visible: false }));
    }, 0);
  }, []);

  // Metodos de conveniencia
  const showSuccess = useCallback((title, message, options = {}) => {
    console.log('showSuccess llamado con:', { title, message, options });
    showAlert({
      type: 'success',
      title,
      message,
      animationType: 'bounce',
      autoClose: true,
      autoCloseDelay: 2500,
      ...options,
    });
  }, [showAlert]);

  const showError = useCallback((title, message, options = {}) => {
    showAlert({
      type: 'error',
      title,
      message,
      animationType: 'bounce',
      // Si no se especifican botones, usar boton de cerrar por defecto
      buttons: options.buttons || [],
      ...options,
    });
  }, [showAlert]);

  const showWarning = useCallback((title, message, options = {}) => {
    showAlert({
      type: 'warning',
      title,
      message,
      animationType: 'slide',
      ...options,
    });
  }, [showAlert]);

  const showInfo = useCallback((title, message, options = {}) => {
    showAlert({
      type: 'info',
      title,
      message,
      animationType: 'fade',
      ...options,
    });
  }, [showAlert]);

  const showConfirm = useCallback((title, message, onConfirm, onCancel, options = {}) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Confirmar',
          style: 'confirm',
          onPress: onConfirm,
        },
      ],
      animationType: 'bounce',
      ...options,
    });
  }, [showAlert]);

  // Alertas para validaciones
  const showValidationError = useCallback((errors) => {
    const errorMessages = Object.values(errors).filter(Boolean);
    const message = errorMessages.length > 1 
      ? `Por favor corrige los siguientes errores:\n\n• ${errorMessages.join('\n• ')}`
      : errorMessages[0] || 'Por favor completa correctamente todos los campos requeridos.';
    
    showError('Campos Incompletos', message, {
      animationType: 'bounce',
      buttons: [], // Usar botón de cerrar por defecto
    });
  }, [showError]);

  const showPaymentError = useCallback((errorType = 'general') => {
    const messages = {
      validation: {
        title: 'Información Incompleta',
        message: 'Por favor completa todos los campos de pago antes de continuar.',
      },
      card: {
        title: 'Tarjeta Inválida',
        message: 'Verifica que los datos de tu tarjeta sean correctos:\n\n• Número de tarjeta válido\n• Fecha no expirada\n• CVV correcto',
      },
      network: {
        title: 'Error de Conexión',
        message: 'No se pudo procesar el pago. Verifica tu conexión a internet e intenta nuevamente.',
      },
      server: {
        title: 'Error del Servidor',
        message: 'Hay un problema temporal con nuestros servidores. Por favor intenta en unos minutos.',
      },
      general: {
        title: 'Pago Rechazado',
        message: 'No se pudo procesar tu pago. Verifica los datos de tu tarjeta e intenta nuevamente.',
      },
    };

    const config = messages[errorType] || messages.general;
    showError(config.title, config.message, {
      buttons: [], // Usar botón de cerrar por defecto
    });
  }, [showError]);

  const showPaymentSuccess = useCallback((amount, options = {}) => {
    showSuccess(
      '¡Pago Exitoso!',
      `Tu compra por $${amount} ha sido procesada correctamente.`,
      {
        autoClose: false,
        buttons: [
          {
            text: 'Ver mis pedidos',
            style: 'confirm',
            onPress: () => {
              // Esta funcion sera pasada desde el componente
            },
          },
        ],
        ...options,
      }
    );
  }, [showSuccess]);

  // Alerta para desconectarse
  const showLogoutConfirm = useCallback((onConfirm, onCancel) => {
    showAlert({
      type: 'warning',
      title: 'Desconectarse',
      message: '¿Estás seguro de que quieres desconectarte?',
      buttons: [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Desconectarse',
          style: 'confirm',
          onPress: onConfirm,
        },
      ],
      animationType: 'bounce',
    });
  }, [showAlert]);

  // Alerta para agregar al carrito
  const showAddToCartSuccess = useCallback((productName, onViewCart, onContinueShopping) => {
    showAlert({
      type: 'success',
      title: '¡Producto añadido!',
      message: `${productName} se ha añadido correctamente al carrito`,
      buttons: [
        {
          text: 'Seguir comprando',
          style: 'cancel',
          onPress: onContinueShopping,
        },
        {
          text: 'Ver carrito',
          style: 'confirm',
          onPress: onViewCart,
        },
      ],
      animationType: 'bounce',
    });
  }, [showAlert]);

  // Alerta para resenas
  const showReviewSuccess = useCallback(() => {
    showSuccess(
      '¡Reseña añadida!',
      'Tu reseña ha sido publicada exitosamente. Gracias por compartir tu experiencia.',
      {
        autoClose: true,
        autoCloseDelay: 3000,
        animationType: 'bounce',
      }
    );
  }, [showSuccess]);

  const showReviewError = useCallback((message = 'No se pudo crear la reseña') => {
    showError('Error al publicar', message, {
      buttons: [], // Usar botón de cerrar por defecto
    });
  }, [showError]);

  const showLoginRequired = useCallback((onLogin, onCancel) => {
    showAlert({
      type: 'info',
      title: 'Inicia sesión',
      message: 'Debes iniciar sesión para escribir una reseña.',
      buttons: [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Iniciar sesión',
          style: 'confirm',
          onPress: onLogin,
        },
      ],
      animationType: 'slide',
    });
  }, [showAlert]);

  // Alerta para permisos
  const showPermissionRequired = useCallback((title, message, onSettings, onCancel) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Ir a Configuración',
          style: 'confirm',
          onPress: onSettings,
        },
      ],
      animationType: 'slide',
    });
  }, [showAlert]);

  // Alerta para seleccionar imagen
  const showImagePickerOptions = useCallback((onCamera, onGallery, onCancel) => {
    showAlert({
      type: 'info',
      title: 'Seleccionar foto',
      message: '¿De dónde quieres obtener la imagen?',
      buttons: [
        {
          text: 'Cámara',
          style: 'confirm',
          onPress: onCamera,
        },
        {
          text: 'Galería',
          style: 'confirm',
          onPress: onGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
      ],
      autoClose: false,
      animationType: 'bounce',
    });
  }, [showAlert]);

  // Alerta de inicio de sesion exitoso
  const showLoginSuccess = useCallback((userName = '') => {
    console.log('showLoginSuccess llamada con userName:', userName);
    const welcomeMessage = userName 
      ? `¡Bienvenido de nuevo, ${userName}!` 
      : '¡Bienvenido de nuevo!';
    
    console.log('Mensaje de bienvenida:', welcomeMessage);
    console.log('Llamando a showSuccess...');
    
    showSuccess(
      'Inicio de sesión correcto',
      welcomeMessage,
      {
        autoClose: true,
        autoCloseDelay: 2500, // 2.5 segundos
        animationType: 'bounce',
        buttons: [], // Sin botones para que se cierre automaticamente
      }
    );
    
    console.log('showSuccess ejecutado');
  }, [showSuccess]);

  // Alerta para stock insuficiente
  const showStockError = useCallback((productName, availableStock, onViewCart, onContinueShopping) => {
    const message = availableStock > 0 
      ? `Solo hay ${availableStock} unidades disponibles de "${productName}".`
      : `"${productName}" está agotado actualmente.`;
    
    showAlert({
      type: 'warning',
      title: 'Stock insuficiente',
      message,
      buttons: [
        {
          text: 'Seguir comprando',
          style: 'cancel',
          onPress: onContinueShopping,
        },
        ...(availableStock > 0 ? [{
          text: 'Ver carrito',
          style: 'confirm',
          onPress: onViewCart,
        }] : []),
      ],
      animationType: 'bounce',
    });
  }, [showAlert]);

  return {
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showValidationError,
    showPaymentError,
    showPaymentSuccess,
    showLogoutConfirm,
    showAddToCartSuccess,
    showReviewSuccess,
    showReviewError,
    showLoginRequired,
    showPermissionRequired,
    showImagePickerOptions,
    showLoginSuccess,
    showStockError,
  };
};

export default useCustomAlert;
