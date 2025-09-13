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
  } = usePayment();

  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    if (!formData.nombre?.trim()) newErrors.nombre = 'Nombre requerido';
    if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.direccion?.trim()) newErrors.direccion = 'Dirección requerida';
    if (!formData.ciudad?.trim()) newErrors.ciudad = 'Ciudad requerida';
    if (!formData.telefono?.trim()) newErrors.telefono = 'Teléfono requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validaciones paso 2
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
          Alert.alert('Error', err?.message || 'No se pudo preparar el pago. Intenta nuevamente.');
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
    if (!validateStep2()) {
      Alert.alert('Error de validación', 'Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }

    try {
      await handleFinishPayment();
      Alert.alert(
        'Pago exitoso',
        'Gracias por tu compra.',
        [
          {
            text: 'Ver mis pedidos',
            onPress: () => {
              clearCart();
              limpiarFormulario();
              // Navegar directamente a la pestaña de Pedidos
              navigation.navigate('Pedidos');
            },
          }
        ]
      );
    } catch (error) {
      console.error('Error al pagar:', error);
      Alert.alert('Pago rechazado', error?.message || 'No se pudo procesar el pago. Intenta de nuevo.');
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

  const handleExpiryChange = (text) => {
    let value = text.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    const [mes, anio] = value.split('/');
    if (mes) handleChangeTarjeta('mesVencimiento', mes);
    if (anio) handleChangeTarjeta('anioVencimiento', `20${anio}`);
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
        colors={['#F8BBD9', '#E8B4CB']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
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
              <Ionicons name="location-outline" size={24} color="#E8B4CB" />
              <Text style={styles.stepTitle}>Datos de envío</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="person-outline" size={16} color="#E8B4CB" />
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
                <Ionicons name="mail-outline" size={16} color="#E8B4CB" />
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
                <Ionicons name="home-outline" size={16} color="#E8B4CB" />
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
                <Ionicons name="call-outline" size={16} color="#E8B4CB" />
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
                <Ionicons name="business-outline" size={16} color="#E8B4CB" />
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
            <View style={styles.stepHeader}>
              <Ionicons name="card-outline" size={24} color="#E8B4CB" />
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
                <Ionicons name="person-outline" size={16} color="#E8B4CB" />
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
                <Ionicons name="card-outline" size={16} color="#E8B4CB" />
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
                  <Ionicons name="calendar-outline" size={16} color="#E8B4CB" />
                  <Text style={styles.inputLabel}>Fecha de vencimiento</Text>
                </View>
                <TextInput
                  style={[styles.textInput, errors.fechaVencimiento && styles.inputError]}
                  value={`${formDataTarjeta.mesVencimiento || ''}${formDataTarjeta.anioVencimiento ? '/' + formDataTarjeta.anioVencimiento.slice(-2) : ''}`}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/AA"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.fechaVencimiento && <Text style={styles.errorText}>{errors.fechaVencimiento}</Text>}
              </View>
              <View style={styles.halfInputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="shield-outline" size={16} color="#E8B4CB" />
                  <Text style={styles.inputLabel}>CVV</Text>
                </View>
                <TextInput
                  style={[styles.textInput, errors.cvv && styles.inputError]}
                  value={formDataTarjeta.cvv || ''}
                  onChangeText={(text) => handleChangeTarjeta('cvv', text)}
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
              <Ionicons name="checkmark-circle" size={80} color="#E8B4CB" />
            </View>
            <Text style={styles.successTitle}>¡Pago exitoso!</Text>
            <Text style={styles.successMessage}>Tu transacción ha sido procesada correctamente</Text>
            <Text style={styles.successAmount}>Monto procesado: ${total.toFixed(2)}</Text>
          </Animated.View>
        )}

        {/* Resumen del pedido */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt-outline" size={24} color="#E8B4CB" />
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
            colors={['#F8BBD9', '#E8B4CB']}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: '#E8B4CB',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: '#E8B4CB',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FEFEFE',
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
    fontWeight: '700',
    color: '#2C3E50',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
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
    shadowColor: '#E8B4CB',
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
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputGroup: {
    width: '48%',
  },
  summaryContainer: {
    backgroundColor: '#FDF7F9',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#F8BBD9',
    shadowColor: '#E8B4CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontWeight: '700',
    color: '#2C3E50',
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
    color: '#2C3E50',
    marginBottom: 2,
  },
  summaryItemDetails: {
    fontSize: 12,
    color: '#6C757D',
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8B4CB',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F8BBD9',
    marginVertical: 10,
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
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F8BBD9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#E8B4CB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#E8B4CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  flexButton: {
    flex: 1,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E8B4CB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#E8B4CB',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#FDF7F9',
    borderRadius: 50,
    padding: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
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
    fontWeight: '600',
    color: '#E8B4CB',
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
