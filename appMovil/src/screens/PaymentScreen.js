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

const { width, height } = Dimensions.get('window');

const PaymentScreen = ({ navigation, route }) => {
  const { totalAmount } = route.params || { totalAmount: 0 };
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
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

  // Validaciones
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (!cleanNumber) return 'El número de tarjeta es requerido';
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return 'El número de tarjeta debe tener entre 13 y 19 dígitos';
    if (!/^\d+$/.test(cleanNumber)) return 'El número de tarjeta solo debe contener números';
    return null;
  };

  const validateCardName = (name) => {
    if (!name.trim()) return 'El nombre del titular es requerido';
    if (name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) return 'El nombre solo debe contener letras';
    return null;
  };

  const validateExpiryDate = (date) => {
    if (!date) return 'La fecha de expiración es requerida';
    if (!/^\d{2}\s*\/\s*\d{4}$/.test(date)) return 'Formato: MM / YYYY';
    
    const [month, year] = date.split('/').map(s => s.trim());
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(month) < 1 || parseInt(month) > 12) return 'Mes inválido';
    if (parseInt(year) < currentYear) return 'La tarjeta ha expirado';
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return 'La tarjeta ha expirado';
    return null;
  };

  const validateCVV = (cvv) => {
    if (!cvv) return 'El CVV es requerido';
    if (!/^\d{3,4}$/.test(cvv)) return 'El CVV debe tener 3 o 4 dígitos';
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    const cardNumberError = validateCardNumber(cardNumber);
    if (cardNumberError) newErrors.cardNumber = cardNumberError;
    
    const cardNameError = validateCardName(cardName);
    if (cardNameError) newErrors.cardName = cardNameError;
    
    const expiryDateError = validateExpiryDate(expiryDate);
    if (expiryDateError) newErrors.expiryDate = expiryDateError;
    
    const cvvError = validateCVV(cvv);
    if (cvvError) newErrors.cvv = cvvError;
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (text) => {
    // Formatear número de tarjeta con espacios cada 4 dígitos
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    
    // Validar en tiempo real
    if (errors.cardNumber) {
      const error = validateCardNumber(formatted);
      if (!error) {
        setErrors(prev => ({ ...prev, cardNumber: null }));
      }
    }
  };

  const handleExpiryDateChange = (text) => {
    // Formatear fecha automáticamente
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 6);
    }
    
    setExpiryDate(formatted);
    
    // Validar en tiempo real
    if (errors.expiryDate) {
      const error = validateExpiryDate(formatted);
      if (!error) {
        setErrors(prev => ({ ...prev, expiryDate: null }));
      }
    }
  };

  const handleFieldBlur = (field) => {
    setFocusedField(null);
    validateForm();
  };

  const handlePayment = () => {
    if (!validateForm()) {
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

    Alert.alert(
      'Pago Exitoso',
      'Tu pedido ha sido procesado correctamente',
      [
        {
          text: 'Continuar',
          onPress: () => navigation.navigate('Inicio'),
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header elegante */}
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

      {/* Resumen de pago elegante */}
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
            <Text style={styles.summaryAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="card" size={28} color="#E8B4B8" />
          </View>
        </View>
      </Animated.View>

      {/* Formulario elegante con mejor manejo del teclado */}
      <ScrollView 
        style={styles.formContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.formContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 100 : 20 }
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
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
              errors.cardNumber && styles.inputError
            ]}>
              <TextInput
                style={styles.cardNumberInput}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
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
              {/* Removed Mastercard icon completely */}
              <TouchableOpacity style={styles.scanIcon}>
                <Ionicons name="scan" size={18} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
          </View>
          {errors.cardNumber && (
            <Text style={styles.errorText}>{errors.cardNumber}</Text>
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
            errors.cardName && styles.inputError
          ]}>
            <TextInput
              style={styles.textInput}
              value={cardName}
              onChangeText={setCardName}
              placeholder="Nombre completo"
              placeholderTextColor="#BDC3C7"
              onFocus={() => setFocusedField('cardName')}
              onBlur={() => handleFieldBlur('cardName')}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          {errors.cardName && (
            <Text style={styles.errorText}>{errors.cardName}</Text>
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
              errors.expiryDate && styles.inputError
            ]}>
              <TextInput
                style={styles.halfInput}
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                placeholder="MM / YYYY"
                placeholderTextColor="#BDC3C7"
                keyboardType="numeric"
                maxLength={9}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => handleFieldBlur('expiry')}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            {errors.expiryDate && (
              <Text style={styles.errorText}>{errors.expiryDate}</Text>
            )}
          </View>
          <View style={styles.halfInputGroup}>
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
                value={cvv}
                onChangeText={setCvv}
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
          <View style={{ height: 50 }} />
        )}
      </ScrollView>

      {/* Botón de pago elegante */}
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
            !isFormValid && styles.paymentButtonDisabled
          ]}
          onPress={handlePayment}
          activeOpacity={0.8}
          disabled={!isFormValid}
        >
          <Ionicons name="card" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.paymentButtonText}>Procesar pago</Text>
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
    paddingBottom: 20,
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
  mastercardIcon: {
    width: 42,
    height: 28,
    backgroundColor: '#E9ECEF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  mastercardText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
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
  },
  halfInputGroup: {
    width: '48%',
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
});

export default PaymentScreen; 