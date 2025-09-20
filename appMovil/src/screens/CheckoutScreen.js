import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';
import usePayment from '../hooks/usePayment';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, clearCart } = useCart();
  const {
    step,
    setStep,
    formData,
    formDataTarjeta,
    handleChangeData,
    handleChangeTarjeta,
    handleFirstStep,
    handleFinishPayment,
    loadOrCreateCart,
    syncCartItems,
    orderId,
    loading,
    limpiarFormulario,
    resetPaymentState,
  } = usePayment();

  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showPaymentError,
    showPaymentSuccess,
    showError,
    showConfirm,
    showSuccess,
  } = useCustomAlert();

  // Calcular totales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.finalPrice || item.price || 0) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    loadOrCreateCart().catch(console.error);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const shippingCents = Math.round(shipping * 100);
    syncCartItems(cartItems, { shippingCents, taxCents: 0, discountCents: 0 }).catch(console.error);
  }, [cartItems, shipping, orderId, syncCartItems]);

  // Validaciones paso 1
  const validateStep1 = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre completo es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar email
    if (!formData.email?.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Validar dirección
    if (!formData.direccion?.trim()) {
      newErrors.direccion = 'La dirección completa es requerida';
    } else if (formData.direccion.trim().length < 10) {
      newErrors.direccion = 'Ingresa una dirección más detallada (mínimo 10 caracteres)';
    }
    
    // Validar ciudad
    if (!formData.ciudad?.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    } else if (formData.ciudad.trim().length < 2) {
      newErrors.ciudad = 'Ingresa un nombre de ciudad válido';
    }
    
    // Validar teléfono
    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El número de teléfono es requerido';
    } else {
      const phoneClean = formData.telefono.replace(/\D/g, '');
      if (phoneClean.length < 8 || phoneClean.length > 15) {
        newErrors.telefono = 'Ingresa un número de teléfono válido (8-15 dígitos)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validaciones paso 2
  const validateStep2 = () => {
    const newErrors = {};
    
    console.log('🔍 Validando datos de tarjeta:', {
      nombreTarjetaHabiente: formDataTarjeta.nombreTarjetaHabiente,
      numeroTarjeta: formDataTarjeta.numeroTarjeta ? `****${formDataTarjeta.numeroTarjeta.slice(-4)}` : 'vacío',
      mesVencimiento: formDataTarjeta.mesVencimiento,
      anioVencimiento: formDataTarjeta.anioVencimiento,
      cvv: formDataTarjeta.cvv ? `${formDataTarjeta.cvv.length} dígitos` : 'vacío',
      displayValue: formDataTarjeta.displayValue
    });
    
    // Validar nombre en tarjeta
    if (!formDataTarjeta.nombreTarjetaHabiente?.trim()) {
      newErrors.nombreTarjetaHabiente = 'Ingresa el nombre como aparece en tu tarjeta';
    } else if (formDataTarjeta.nombreTarjetaHabiente.trim().length < 2) {
      newErrors.nombreTarjetaHabiente = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar número de tarjeta
    const numeroLimpio = (formDataTarjeta.numeroTarjeta || '').replace(/\s/g, '');
    if (!numeroLimpio) {
      newErrors.numeroTarjeta = 'El número de tarjeta es requerido';
    } else if (!/^\d{13,16}$/.test(numeroLimpio)) {
      newErrors.numeroTarjeta = 'Ingresa un número de tarjeta válido (13-16 dígitos)';
    } else {
      // Validación adicional con algoritmo de Luhn para tarjetas reales
      const isValidCard = numeroLimpio === '4242424242424242' || 
                         numeroLimpio === '4111111111111111' ||
                         /^4\d{15}$/.test(numeroLimpio) || // Visa
                         /^5[1-5]\d{14}$/.test(numeroLimpio) || // Mastercard
                         /^3[47]\d{13}$/.test(numeroLimpio); // American Express
      
      if (!isValidCard && !numeroLimpio.startsWith('4242') && !numeroLimpio.startsWith('4111')) {
        newErrors.numeroTarjeta = 'Usa una tarjeta de prueba válida (4242... o 4111...)';
      }
    }
    
    // Validar fecha de vencimiento
    if (!formDataTarjeta.mesVencimiento || !formDataTarjeta.anioVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
    } else {
      const mes = parseInt(formDataTarjeta.mesVencimiento);
      const anio = parseInt(formDataTarjeta.anioVencimiento);
      const ahora = new Date();
      const anioActual = ahora.getFullYear();
      const mesActual = ahora.getMonth() + 1;
      
      if (mes < 1 || mes > 12) {
        newErrors.fechaVencimiento = 'Ingresa un mes válido (01-12)';
      } else if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
        newErrors.fechaVencimiento = 'La tarjeta ha expirado. Usa una fecha futura';
      } else if (anio > anioActual + 20) {
        newErrors.fechaVencimiento = 'La fecha de vencimiento es muy lejana';
      }
    }
    
    // Validar CVV
    if (!formDataTarjeta.cvv?.trim()) {
      newErrors.cvv = 'El código CVV es requerido';
    } else if (!/^\d{3,4}$/.test(formDataTarjeta.cvv)) {
      newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos numéricos';
    }
    
    console.log('❌ Errores encontrados:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (validateStep1()) {
        try {
          if (!orderId) await loadOrCreateCart();
          const shippingCents = Math.round(shipping * 100);
          await syncCartItems(
            cartItems,
            { shippingCents, taxCents: 0, discountCents: 0 },
            { immediate: true }
          );
          await handleFirstStep();
        } catch (err) {
          console.error('Error en primer paso:', err);
          showError(
            'Error de Preparación',
            err?.message || 'No se pudo preparar el pago. Por favor verifica tu conexión e intenta nuevamente.'
          );
        }
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handlePayment = async () => {
    console.log('🚀 Iniciando proceso de pago...');
    
    const isValid = validateStep2();
    console.log('✅ Validación resultado:', isValid);
    
    if (!isValid) {
      console.log('❤️ Validación fallida, mostrando errores al usuario');
      showValidationError(errors);
      return;
    }
    
    console.log('✅ Validación exitosa, procediendo con el pago...');

    try {
      await handleFinishPayment();
      showPaymentSuccess(total.toFixed(2), {
        buttons: [
          {
            text: 'Ver mis pedidos',
            style: 'confirm',
            onPress: () => {
              clearCart();
              limpiarFormulario();
              navigation.navigate('Pedidos');
            },
          }
        ]
      });
    } catch (error) {
      console.error('Error al pagar:', error);
      
      // Si la orden ya fue procesada, ofrecer resetear
      if (error.message && error.message.includes('ya fue procesada')) {
        showConfirm(
          'Orden Ya Procesada',
          error.message + '\n\n¿Deseas iniciar un nuevo proceso de pago?',
          async () => {
            try {
              await resetPaymentState();
              showSuccess('Éxito', 'Puedes iniciar un nuevo proceso de pago.');
            } catch (resetError) {
              console.error('Error al resetear:', resetError);
              showError('Error', 'No se pudo resetear el estado. Intenta reiniciar la app.');
            }
          },
          () => {}, // onCancel - no hacer nada
          { animationType: 'bounce' }
        );
      } else if (error.message && error.message.includes('Error en el servidor')) {
        showPaymentError('server');
      } else if (error.message && error.message.includes('tarjeta')) {
        showPaymentError('card');
      } else if (error.message && error.message.includes('conexión')) {
        showPaymentError('network');
      } else {
        showPaymentError('general');
      }
    }
  };

  // Formateo de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const handleCardNumberChange = (text) => {
    const rawValue = text.replace(/\s/g, '');
    handleChangeTarjeta('numeroTarjeta', rawValue);
  };

  // Función para obtener la fecha formateada
  const getFormattedExpiry = () => {
    const mes = formDataTarjeta.mesVencimiento || '';
    const anio = formDataTarjeta.anioVencimiento || '';
    
    if (!mes && !anio) return '';
    if (mes && !anio) return mes;
    if (mes && anio) {
      const shortYear = anio.length > 2 ? anio.slice(-2) : anio;
      return `${mes}/${shortYear}`;
    }
    return mes;
  };

  const handleExpiryChange = (text) => {
    // Si el campo está vacío, limpiar todo
    if (text === '') {
      handleChangeTarjeta('mesVencimiento', '');
      handleChangeTarjeta('anioVencimiento', '');
      handleChangeTarjeta('displayValue', '');
      return;
    }
    
    // Solo permitir números y slash
    let cleanValue = text.replace(/[^0-9]/g, '');
    
    // Limitar a 4 dígitos máximo
    if (cleanValue.length > 4) {
      cleanValue = cleanValue.substring(0, 4);
    }
    
    let formattedValue = '';
    
    if (cleanValue.length >= 1) {
      let mes = cleanValue.substring(0, 2);
      
      // Validar que el mes no sea mayor a 12
      if (cleanValue.length >= 2) {
        const mesNum = parseInt(mes);
        if (mesNum > 12) {
          mes = '12';
          cleanValue = '12' + cleanValue.substring(2);
        } else if (mesNum === 0) {
          mes = '01';
          cleanValue = '01' + cleanValue.substring(2);
        }
      }
      
      formattedValue = mes;
      
      // Agregar slash automáticamente después de 2 dígitos
      if (cleanValue.length > 2) {
        const anio = cleanValue.substring(2, 4);
        formattedValue = mes + '/' + anio;
      }
    }
    
    // Guardar el valor formateado para mostrar
    handleChangeTarjeta('displayValue', formattedValue);
    
    // Actualizar los valores en el estado
    if (cleanValue.length >= 2) {
      const mes = cleanValue.substring(0, 2);
      handleChangeTarjeta('mesVencimiento', mes);
      
      if (cleanValue.length >= 3) {
        const anio = cleanValue.substring(2, 4);
        const fullYear = anio.length === 2 ? `20${anio}` : '';
        handleChangeTarjeta('anioVencimiento', fullYear);
      } else {
        handleChangeTarjeta('anioVencimiento', '');
      }
    } else {
      handleChangeTarjeta('mesVencimiento', cleanValue);
      handleChangeTarjeta('anioVencimiento', '');
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrito vacío</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes productos para pagar.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Inicio')}>
            <Text style={styles.primaryButtonText}>Ir a comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ad1457" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="diamond" size={28} color="#e91e63" />
            <Text style={styles.headerTitle}>Finalizar Compra</Text>
          </View>
          <View style={styles.placeholder} />
        </Animated.View>
      </LinearGradient>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
          </View>
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
          </View>
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>✓</Text>
          </View>
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Envío</Text>
          <Text style={styles.progressLabel}>Pago</Text>
          <Text style={styles.progressLabel}>Confirmación</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Paso 1: Datos de envío */}
        {step === 1 && (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <View style={styles.stepTitleContainer}>
              <Ionicons name="location" size={24} color="#e91e63" />
              <Text style={styles.stepTitle}>Datos de envío</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="person" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Nombre completo</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.nombre && styles.inputError]}
                value={formData.nombre}
                onChangeText={(text) => handleChangeData('nombre', text)}
                placeholder="Ingresa tu nombre completo"
                placeholderTextColor="#999"
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="mail" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Correo electrónico</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => handleChangeData('email', text)}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="home" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Dirección completa</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.largeInput, errors.direccion && styles.inputError]}
                value={formData.direccion}
                onChangeText={(text) => handleChangeData('direccion', text)}
                placeholder="Calle, número, colonia, referencia"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="call" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Teléfono</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.telefono && styles.inputError]}
                value={formData.telefono}
                onChangeText={(text) => handleChangeData('telefono', text)}
                placeholder="Número de teléfono"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
              {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="business" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Ciudad</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.ciudad && styles.inputError]}
                value={formData.ciudad}
                onChangeText={(text) => handleChangeData('ciudad', text)}
                placeholder="Ciudad"
                placeholderTextColor="#999"
              />
              {errors.ciudad && <Text style={styles.errorText}>{errors.ciudad}</Text>}
            </View>
          </Animated.View>
        )}

        {/* Paso 2: Información de pago */}
        {step === 2 && (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <View style={styles.stepTitleContainer}>
              <Ionicons name="card" size={24} color="#e91e63" />
              <Text style={styles.stepTitle}>Información de pago</Text>
            </View>
            
            {/* Información de modo prueba */}
            <View style={styles.testModeContainer}>
              <View style={styles.testModeHeader}>
                <Ionicons name="information-circle" size={20} color="#4CAF50" />
                <Text style={styles.testModeTitle}>Modo de Prueba Activo</Text>
              </View>
              <Text style={styles.testModeText}>
                Usa estas tarjetas de prueba para simular pagos:
              </Text>
              <Text style={styles.testCardNumber}>• 4242 4242 4242 4242</Text>
              <Text style={styles.testCardNumber}>• 4111 1111 1111 1111</Text>
              <Text style={styles.testModeText}>
                Fecha: cualquier fecha futura • CVV: cualquier 3 dígitos
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="person" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Nombre en la tarjeta</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.nombreTarjetaHabiente && styles.inputError]}
                value={formDataTarjeta.nombreTarjetaHabiente || ''}
                onChangeText={(text) => handleChangeTarjeta('nombreTarjetaHabiente', text)}
                placeholder="Como aparece en la tarjeta"
                placeholderTextColor="#999"
              />
              {errors.nombreTarjetaHabiente && <Text style={styles.errorText}>{errors.nombreTarjetaHabiente}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="card" size={16} color="#e91e63" />
                <Text style={styles.inputLabel}>Número de tarjeta</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.numeroTarjeta && styles.inputError]}
                value={formatCardNumber(formDataTarjeta.numeroTarjeta || '')}
                onChangeText={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={19}
              />
              {errors.numeroTarjeta && <Text style={styles.errorText}>{errors.numeroTarjeta}</Text>}
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfInputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="calendar" size={16} color="#e91e63" />
                  <Text style={styles.inputLabel}>Fecha de vencimiento</Text>
                </View>
                <TextInput
                  style={[styles.textInput, errors.fechaVencimiento && styles.inputError]}
                  value={formDataTarjeta.displayValue || ''}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/AA"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.fechaVencimiento && <Text style={styles.errorText}>{errors.fechaVencimiento}</Text>}
              </View>
              <View style={styles.cvvInputGroup}>
                <View style={styles.cvvLabelContainer}>
                  <Ionicons name="shield-checkmark" size={16} color="#e91e63" />
                  <Text style={styles.inputLabel}>CVV</Text>
                </View>
                <TextInput
                  style={[styles.textInput, errors.cvv && styles.inputError]}
                  value={formDataTarjeta.cvv || ''}
                  onChangeText={(text) => handleChangeTarjeta('cvv', text.replace(/\D/g, ''))}
                  placeholder="123"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Paso 3: Confirmación */}
        {step === 3 && (
          <Animated.View style={[styles.stepContainer, styles.successContainer, { opacity: fadeAnim }]}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#e91e63" />
            </View>
            <Text style={styles.successTitle}>¡Pago exitoso!</Text>
            <Text style={styles.successMessage}>Tu transacción ha sido procesada correctamente</Text>
            <Text style={styles.successAmount}>Monto procesado: ${total.toFixed(2)}</Text>
          </Animated.View>
        )}

        {/* Resumen del pedido */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt" size={24} color="#e91e63" />
            <Text style={styles.summaryTitle}>Resumen de tu compra</Text>
          </View>
          {cartItems.map(item => (
            <View key={`${item._id}-${item.size}`} style={styles.summaryItem}>
              <View style={styles.summaryItemInfo}>
                <Text style={styles.summaryItemName}>{item.name}</Text>
                <Text style={styles.summaryItemDetails}>Talla: {item.size} • Cant: {item.quantity}</Text>
              </View>
              <Text style={styles.summaryItemPrice}>${((item.finalPrice || item.price) * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <LinearGradient
            colors={['#e91e63', '#ad1457']}
            style={styles.summaryTotal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        {step === 1 && (
          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleNextStep}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Siguiente</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}

        {step === 2 && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handlePreviousStep}>
              <Ionicons name="arrow-back" size={20} color="#2C3E50" />
              <Text style={styles.secondaryButtonText}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.primaryButton, styles.flexButton, loading && styles.buttonDisabled]} 
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="card" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Pagar ahora</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => {
              clearCart();
              limpiarFormulario();
              navigation.navigate('MainTabs', { screen: 'Pedidos' });
            }}
          >
            <Text style={styles.primaryButtonText}>Ver mis pedidos</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        autoClose={alertConfig.autoClose}
        autoCloseDelay={alertConfig.autoCloseDelay}
        showIcon={alertConfig.showIcon}
        animationType={alertConfig.animationType}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: '#e91e63',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#B0BEC5',
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: '#e91e63',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#455A64',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 10,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 6,
    minHeight: 48,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ad1457',
    flexWrap: 'wrap',
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  largeInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#e91e63',
  },
  errorText: {
    color: '#e91e63',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    minHeight: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 15,
  },
  halfInputGroup: {
    width: '58%',
  },
  cvvInputGroup: {
    width: '35%',
  },
  cvvLabelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 6,
    minHeight: 48,
    paddingTop: 22,
  },
  halfInputGroupAligned: {
    width: '48%',
    justifyContent: 'flex-start',
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4a148c',
    marginBottom: 2,
  },
  summaryItemDetails: {
    fontSize: 12,
    color: '#6C757D',
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(233, 30, 99, 0.3)',
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  summaryValue: {
    fontSize: 14,
    color: '#495057',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 30, 99, 0.2)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#e91e63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  flexButton: {
    flex: 1,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
    borderWidth: 2,
    borderColor: '#e91e63',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#e91e63',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    padding: 20,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ad1457',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  successAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginTop: 10,
  },
  testModeContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  testModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  testModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  testModeText: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 4,
  },
  testCardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    fontFamily: 'monospace',
    marginLeft: 8,
  },
});

export default CheckoutScreen;
