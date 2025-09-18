import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VerifyCodeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, isPasswordRecovery = false } = route.params;
  const [code, setCode] = useState(['', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success' or 'error'
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Inicializar referencias de los inputs
  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]).current;

  // Referencias para las animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;

  // Efecto para el contador de reenvío
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Efecto para animaciones de entrada
  useEffect(() => {
    // Animación de entrada suave
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
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Verificar el código
  const verifyCode = async () => {
    const codeString = code.join('');
    if (codeString.length !== 5) {
      setCodeError('Por favor ingresa los 5 dígitos del código');
      setVerificationStatus('error');
      return false;
    }

    setIsLoading(true);
    setCodeError('');
    
    let response;
    try {
      if (isPasswordRecovery) {
        // Para recuperación de contraseña
        response = await fetch('http://192.168.56.1.200:4000/api/recoveryPassword/verifyCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: codeString
          }),
          credentials: 'include' // Importante para enviar las cookies
        });
      } else {
        // Obtener el token de verificación guardado
        const verificationToken = await AsyncStorage.getItem('verificationToken');
        
        if (!verificationToken) {
          throw new Error('No se encontró el token de verificación. Por favor, regístrese nuevamente.');
        }

        // Para verificación de email
        response = await fetch('http://192.168.1.200:4000/api/registerCustomers/verifyCodeEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${verificationToken}`
          },
          body: JSON.stringify({
            verificationCode: codeString
          })
        });
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Respuesta no es JSON:', text);
        throw new Error('Respuesta del servidor no válida');
      }
      
      if (!response.ok) {
        const errorMessage = data.message || 'Error al verificar el código';
        setCodeError(errorMessage);
        setVerificationStatus('error');
        throw new Error(errorMessage);
      }

      setVerificationStatus('success');
      
      // Navegar a la pantalla de nueva contraseña o dashboard según corresponda
      if (isPasswordRecovery) {
        navigation.navigate('NewPassword', { 
          email, 
          code: codeString,
          token: data.token
        });
      } else {
        // Navegar al dashboard o pantalla principal
        navigation.navigate('App');
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar el código:', error.message);
      // Solo mostrar el mensaje de error si no es un error de validación de longitud
      if (error.message !== 'Por favor ingresa los 5 dígitos del código') {
        setCodeError('Código incorrecto o expirado. Por favor, verifica e inténtalo de nuevo.');
        setVerificationStatus('error');
      }
      setCodeError(error.message || 'Código inválido o expirado');
      setVerificationStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los inputs de código
  const handleCodeChange = (text, index) => {
    // Solo permitir dígitos
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Crear un nuevo array con el código actual
    const newCode = [...code];
    
    // Asegurarse de que el índice sea válido
    if (index >= 0 && index < 5) {
      // Actualizar solo si el valor es un dígito o está vacío
      newCode[index] = numericValue.slice(0, 1); // Tomar solo el primer dígito
      setCode(newCode);
      
      // Mover al siguiente campo si se ingresó un dígito
      if (numericValue && index < 4 && inputRefs[index + 1]?.current) {
        inputRefs[index + 1].current.focus();
      }
      
      // Limpiar mensajes de error al escribir
      setVerificationStatus(null);
      setCodeError('');
      
      // Si se completaron los 5 dígitos, verificar automáticamente
      const isComplete = newCode.every(digit => digit !== '') && newCode.length === 5;
      if (isComplete) {
        verifyCode();
      }
    }
  };
  
  // Manejar tecla borrar
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // Si el campo está vacío y se presiona borrar, ir al campo anterior
      inputRefs[index - 1].current.focus();
    }
  };

  // Validar formulario cada vez que cambie el código
  const validateForm = () => {
    const codeString = code.join('');
    const isValid = codeString.length === 5 && /^\d+$/.test(codeString);
    setIsFormValid(isValid);
    return isValid;
  };

  // Efecto para validar el formulario cuando cambia el código
  useEffect(() => {
    if (code) {
      validateForm();
    }
  }, [code]);

  // Reenviar código
  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.200:4000/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userType: 'customer',
          isPasswordRecovery
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar el código');
      }
      
      // Reiniciar el contador
      setCountdown(60);
      setCanResend(false);
      setVerificationStatus(null);
      setCodeError('');
      
      // Iniciar el contador
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      
      // Limpiar campos
      setCode(['', '', '', '', '']);
      if (inputRefs[0]?.current) {
        inputRefs[0].current.focus();
      }
      
      // Mostrar mensaje de éxito
      setVerificationStatus('resend_success');
      
    } catch (error) {
      console.error('Error al reenviar el código:', error);
      setCodeError(error.message || 'Ocurrió un error al reenviar el código');
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar el código
  const handleVerifyCode = async () => {
    if (code.join('').length !== 5) {
      setCodeError('Por favor ingresa un código válido de 5 dígitos');
      setVerificationStatus('error');
      return;
    }
    await verifyCode();
  };
  
  // Efecto para manejar el contador de reenvío
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleBack = () => {
    // Animación de salida antes de regresar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.background}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Botón de regreso */}
              <Animated.View style={[styles.backButtonContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <TouchableOpacity 
                  onPress={handleBack}
                  disabled={isLoading}
                >
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.title}>{isPasswordRecovery ? 'Recuperar Contraseña' : 'Verificación'}</Text>
                <Text style={styles.subtitle}>
                  {isPasswordRecovery
                    ? 'Ingresa el código de verificación que enviamos a tu correo electrónico para restablecer tu contraseña.'
                    : 'Ingresa el código de verificación que enviamos a tu correo electrónico.'}
                </Text>
              </Animated.View>

              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
              <View style={styles.codeContainer}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <TextInput
                    key={`code-input-${index}`}
                    ref={(ref) => {
                      if (ref) {
                        inputRefs[index] = { current: ref };
                      }
                    }}
                    style={[
                      styles.codeInput, 
                      verificationStatus === 'error' && styles.inputError,
                      verificationStatus === 'success' && styles.inputSuccess
                    ]}
                    value={code[index] || ''}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                    returnKeyType={index === 4 ? 'done' : 'next'}
                    blurOnSubmit={false}
                    editable={!isLoading}
                  />
                ))}
              </View>

              {/* Mensajes de estado */}
              {verificationStatus === 'error' && codeError ? (
                <Text style={styles.errorText}>{codeError}</Text>
              ) : verificationStatus === 'resend_success' ? (
                <Text style={styles.successText}>¡Código reenviado con éxito!</Text>
              ) : (
                <Text style={styles.hintText}>
                  Ingresa el código de 5 dígitos que enviamos a {email}
                </Text>
              )}

              {/* Botón de verificación (opcional, ya que se verifica automáticamente) */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={verifyCode}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Verificando...' : 'Verificar Código'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  ¿No recibiste el código?{' '}
                  <Text
                    style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}
                    onPress={canResend ? handleResendCode : undefined}
                  >
                    {canResend ? 'Reenviar código' : `Reenviar en ${countdown}s`}
                  </Text>
                </Text>
              </View>
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff8f8',
  },
  inputSuccess: {
    borderColor: '#2ecc71',
    backgroundColor: '#f0fdf4',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  successText: {
    color: '#2ecc71',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  hintText: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  resendLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: '#bdc3c7',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  codeInput: {
    width: 55,
    height: 65,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    color: '#2c3e50',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff8f8',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    marginTop: -15,
  },
  hintText: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#d4af37',
    borderRadius: 30,
    height: 58,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});

export default VerifyCodeScreen;
