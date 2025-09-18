import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Alert,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';
import usePayment from '../hooks/usePayment';

const { width, height } = Dimensions.get('window');

const PaymentScreen = ({ navigation, route }) => {
  const { cartItems, clearCart } = useCart();
  const {
    step,
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
  } = usePayment();

  // Calcular totales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.finalPrice || item.price || 0) * item.quantity, 0);
  const shipping = 0; // Sin costo de envío para testear
  const total = subtotal + shipping;
  
  const [focusedField, setFocusedField] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Animaciones simplificadas para evitar conflictos
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Animación de entrada simple y estable
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Cargar/crear carrito servidor al entrar a checkout
    loadOrCreateCart().catch(console.error);

    // Configurar listeners del teclado
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Sincronizar ítems del carrito local al backend cuando YA tenemos orderId
  useEffect(() => {
    if (!orderId) return;
    const shippingCents = Math.round(shipping * 100);
    syncCartItems(cartItems, { shippingCents, taxCents: 0, discountCents: 0 }).catch(console.error);
  }, [cartItems, shipping, orderId, syncCartItems]);

  // Validaciones para paso 1 (datos de envío)
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = 'Nombre requerido';
    if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.direccion?.trim()) newErrors.direccion = 'Dirección requerida';
    if (!formData.ciudad?.trim()) newErrors.ciudad = 'Ciudad requerida';
    if (!formData.codigoPostal?.trim() || !/^\d{3,10}$/.test(formData.codigoPostal)) newErrors.codigoPostal = 'Código postal inválido';
    if (!formData.telefono?.trim()) newErrors.telefono = 'Teléfono requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validaciones para paso 2 (datos de tarjeta)
  const validateStep2 = () => {
    const newErrors = {};
    if (!formDataTarjeta.nombreTarjetaHabiente?.trim()) {
      newErrors.nombreTarjetaHabiente = 'Nombre en la tarjeta requerido';
    }
    if (
      !formDataTarjeta.numeroTarjeta?.trim() ||
      !/^\d{13,16}$/.test(formDataTarjeta.numeroTarjeta.replace(/\s/g, ''))
    ) {
      newErrors.numeroTarjeta = 'Tarjeta inválida (13-16 dígitos numéricos)';
    }
    if (!formDataTarjeta.mesVencimiento || !formDataTarjeta.anioVencimiento) {
      newErrors.fechaVencimiento = 'Fecha de vencimiento requerida';
    }
    if (!formDataTarjeta.cvv?.trim() || !/^\d{3,4}$/.test(formDataTarjeta.cvv)) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Ir al siguiente paso
  const handleNextStep = async () => {
    if (step === 1) {
      if (validateStep1()) {
        try {
          // Asegurar orden + sync inmediata antes de pending_payment
          if (!orderId) await loadOrCreateCart();
          const shippingCents = Math.round(shipping * 100);
          await syncCartItems(
            cartItems,
            { shippingCents, taxCents: 0, discountCents: 0 },
            { immediate: true }
          );

          // Guardar dirección → pending → token → step 2
          await handleFirstStep();
        } catch (err) {
          console.error('Error en primer paso:', err);
          Alert.alert(
            'Error',
            err?.message || 'No se pudo preparar el pago. Intenta nuevamente.'
          );
        }
      }
    }
  };

  // Volver al paso anterior
  const handlePreviousStep = () => {
    if (step > 1) {
      // En React Native no tenemos setStep directamente, usamos el del hook
      // setStep(step - 1); // Esto se maneja en el hook
      setErrors({});
    }
  };

  // Formatear número de tarjeta (solo visual)
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

  // Número de tarjeta visual, guardando sin espacios
  const handleCardNumberChange = (text) => {
    const rawValue = text.replace(/\s/g, '');
    const formattedValue = formatCardNumber(text);
    handleChangeTarjeta('numeroTarjeta', rawValue);
    return formattedValue;
  };

  // Fecha (MM/AA) → guarda MM + YYYY
  const handleExpiryChange = (text) => {
    let value = text.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    const [mes, anio] = value.split('/');
    if (mes) handleChangeTarjeta('mesVencimiento', mes);
    if (anio) handleChangeTarjeta('anioVencimiento', `20${anio}`);
    return value;
  };

  const handleFieldBlur = (field) => {
    setFocusedField(null);
    if (step === 1) validateStep1();
    if (step === 2) validateStep2();
  };

  // Procesar pago final
  const handlePayment = async () => {
    if (!validateStep2()) {
      Alert.alert(
        'Error de validación',
        'Por favor, corrige los errores en el formulario antes de continuar.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Animación simple del botón
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await handleFinishPayment(); // Procesa 3DS; si aprueba, step=3
      Alert.alert(
        'Pago exitoso',
        'Gracias por tu compra.',
        [
          {
            text: 'Ver mis pedidos',
            onPress: () => {
              clearCart();
              limpiarFormulario();
              navigation.navigate('Inicio');
            },
          }
        ]
      );
    } catch (error) {
      console.error('Error al pagar:', error);
      Alert.alert(
        'Pago rechazado',
        error?.message || 'No se pudo procesar el pago. Intenta de nuevo.'
      );
    }
  };

  // Limpiar formulario y reiniciar
  const handleNewTransaction = () => {
    clearCart();
    limpiarFormulario();
    navigation.navigate('Inicio');
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrito vacío</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.emptyText}>No tienes productos para pagar.</Text>
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={() => navigation.navigate('Inicio')}
          >
            <Text style={styles.paymentButtonText}>Ir a comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Realizar compra</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        <View style={styles.placeholder} />
      </Animated.View>

      {/* Resumen de pago */}
      <Animated.View 
        style={[
          styles.paymentSummary,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.summaryContainer}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Total a pagar</Text>
            <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="card" size={28} color="#E8B4B8" />
          </View>
        </View>
      </Animated.View>

      {/* Formulario */}
      <ScrollView 
        style={styles.formContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.formContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 100 }
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardDismissMode="interactive"
        scrollEventThrottle={16}
      >
        {/* Número de tarjeta */}
        <Animated.View 
          style={[
            styles.inputGroup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.labelContainer}>
            <Ionicons name="card" size={18} color="#7F8C8D" style={styles.labelIcon} />
            <Text style={styles.inputLabel}>Número de tarjeta</Text>
          </View>
          <View style={styles.cardNumberContainer}>
            <View style={[
              styles.inputContainer,
              errors.numeroTarjeta && styles.inputError
            ]}>
              <TextInput
                style={styles.cardNumberInput}
                value={formatCardNumber(formDataTarjeta.numeroTarjeta || '')}
                onChangeText={(text) => {
                  const formatted = handleCardNumberChange(text);
                }}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#BDC3C7"
                keyboardType="numeric"
                maxLength={19}
                onFocus={() => setFocusedField('cardNumber')}
                onBlur={() => handleFieldBlur('cardNumber')}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.cardIcons}>
              <TouchableOpacity style={styles.scanIcon}>
                <Ionicons name="scan" size={18} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
          </View>
          {errors.numeroTarjeta && (
            <Text style={styles.errorText}>{errors.numeroTarjeta}</Text>
          )}
        </Animated.View>

        {/* Nombre de tarjeta */}
        <Animated.View 
          style={[
            styles.inputGroup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.labelContainer}>
            <Ionicons name="person" size={18} color="#7F8C8D" style={styles.labelIcon} />
            <Text style={styles.inputLabel}>Nombre del titular</Text>
          </View>
          <View style={[
            styles.inputContainer,
            errors.nombreTarjetaHabiente && styles.inputError
          ]}>
            <TextInput
              style={styles.textInput}
              value={formDataTarjeta.nombreTarjetaHabiente || ''}
              onChangeText={(text) => handleChangeTarjeta('nombreTarjetaHabiente', text)}
              placeholder="Nombre completo"
              placeholderTextColor="#BDC3C7"
              onFocus={() => setFocusedField('cardName')}
              onBlur={() => handleFieldBlur('cardName')}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          {errors.nombreTarjetaHabiente && (
            <Text style={styles.errorText}>{errors.nombreTarjetaHabiente}</Text>
          )}
        </Animated.View>

        {/* Fecha y CVV */}
        <Animated.View 
          style={[
            styles.rowContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.halfInputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="calendar" size={18} color="#7F8C8D" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>Fecha de expiración</Text>
            </View>
            <View style={[
              styles.inputContainer,
              errors.fechaVencimiento && styles.inputError
            ]}>
              <TextInput
                style={styles.halfInput}
                value={`${formDataTarjeta.mesVencimiento || ''}${formDataTarjeta.anioVencimiento ? '/' + formDataTarjeta.anioVencimiento.slice(-2) : ''}`}
                onChangeText={(text) => {
                  const formatted = handleExpiryChange(text);
                }}
                placeholder="MM/AA"
                placeholderTextColor="#BDC3C7"
                keyboardType="numeric"
                maxLength={5}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => handleFieldBlur('expiry')}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            {errors.fechaVencimiento && (
              <Text style={styles.errorText}>{errors.fechaVencimiento}</Text>
            )}
          </View>
          
          <View style={styles.cvvInputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="lock-closed" size={18} color="#7F8C8D" style={styles.labelIcon} />
              <Text style={styles.inputLabel}>CVV/CVC</Text>
            </View>
            <View style={[
              styles.inputContainer,
              errors.cvv && styles.inputError
            ]}>
              <TextInput
                style={styles.halfInput}
                value={formDataTarjeta.cvv || ''}
                onChangeText={(text) => handleChangeTarjeta('cvv', text)}
                placeholder="123"
                placeholderTextColor="#BDC3C7"
                keyboardType="numeric"
                maxLength={4}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => handleFieldBlur('cvv')}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
            {errors.cvv && (
              <Text style={styles.errorText}>{errors.cvv}</Text>
            )}
          </View>
        </Animated.View>

        {/* Espacio extra para el teclado */}
        {keyboardHeight > 0 && (
          <View style={{ height: 80 }} />
        )}
      </ScrollView>

      {/* Botón de pago */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            loading && styles.paymentButtonDisabled
          ]}
          onPress={handlePayment}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Ionicons name="card" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.paymentButtonText}>
            {loading ? 'Procesando...' : 'Procesar pago'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 40,
    height: 2,
    backgroundColor: '#E8B4B8',
    borderRadius: 1,
    marginTop: 8,
  },
  placeholder: {
    width: 44,
  },
  paymentSummary: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContent: {
    paddingBottom: 300,
  },
  inputGroup: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelIcon: {
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    letterSpacing: 0.3,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 2,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 10,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumberInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 16,
    fontWeight: '500',
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textInput: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    minHeight: 120,
  },
  halfInputGroup: {
    width: '48%',
  },
  cvvInputGroup: {
    width: '48%',
    marginTop: 40,
  },
  halfInput: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  paymentButton: {
    backgroundColor: '#2C3E50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  paymentButtonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 12,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PaymentScreen;