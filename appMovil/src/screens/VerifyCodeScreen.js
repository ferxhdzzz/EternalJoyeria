import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
 
const { width, height } = Dimensions.get('window');
 
const VerifyCodeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, isPasswordRecovery = false } = route.params;
  // Determinar la longitud del código según el tipo
  const codeLength = isPasswordRecovery ? 5 : 6;
  const [code, setCode] = useState(new Array(codeLength).fill(''));
  const [codeError, setCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success' or 'error'
  const [isFormValid, setIsFormValid] = useState(false);
 
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showSuccess,
    showError,
  } = useCustomAlert();
 
  // Inicializar referencias de los inputs dinámicamente
  const inputRefs = useRef(
    new Array(codeLength).fill(null).map(() => React.createRef())
  ).current;
 
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
 
  // Verificar el código con string específico
  const verifyCodeWithString = async (codeString) => {
    console.log('Verificando código con string:', codeString, 'Longitud:', codeString.length);
   
    if (codeString.length !== codeLength) {
      setCodeError(`Por favor completa todos los campos del código`);
      setVerificationStatus('error');
      return false;
    }
   
    console.log('Validación exitosa, procediendo con verificación...');
 
    setIsLoading(true);
    setCodeError('');
   
    let response;
    try {
      if (isPasswordRecovery) {
        // Obtener el token de recuperación guardado
        const recoveryToken = await AsyncStorage.getItem('recoveryToken');
       
        if (!recoveryToken) {
          throw new Error('No se encontró el token de recuperación. Por favor, solicita un nuevo código.');
        }
 
        // Para recuperación de contraseña
        response = await fetch(buildApiUrl(API_ENDPOINTS.RECOVERY_VERIFY), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${recoveryToken}`
          },
          body: JSON.stringify({
            code: codeString
          })
        });
      } else {
        // Obtener el token de verificación guardado
        const verificationToken = await AsyncStorage.getItem('verificationToken');
       
        if (!verificationToken) {
          throw new Error('No se encontró el token de verificación. Por favor, regístrese nuevamente.');
        }
 
        // Para verificación de email
        response = await fetch(buildApiUrl(API_ENDPOINTS.VERIFY_EMAIL), {
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
        const errorMessage = data.message || 'Código incorrecto o expirado';
        setCodeError(errorMessage);
        setVerificationStatus('error');
        showError('Código Incorrecto', errorMessage);
        return false;
      }
 
      setVerificationStatus('success');
     
      // Navegar a la pantalla de nueva contraseña o login según corresponda
      if (isPasswordRecovery) {
        showSuccess(
          'Código Verificado',
          'El código ha sido verificado correctamente. Ahora puedes establecer tu nueva contraseña.',
          {
            autoClose: false,
            buttons: [
              {
                text: 'Continuar',
                style: 'confirm',
                onPress: () => {
                  navigation.navigate('NewPassword', {
                    email,
                    code: codeString,
                    token: data.token
                  });
                }
              }
            ]
          }
        );
      } else {
        // Después del registro exitoso, navegar al login para que inicie sesión
        showSuccess(
          '¡Cuenta Verificada!',
          'Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión.',
          {
            autoClose: false,
            buttons: [
              {
                text: 'Iniciar Sesión',
                style: 'confirm',
                onPress: () => {
                  navigation.navigate('Login');
                }
              }
            ]
          }
        );
      }
     
      return true;
    } catch (error) {
      console.error('Error al verificar el código:', error.message);
      const errorMessage = error.message || 'Código inválido o expirado';
      setCodeError(errorMessage);
      setVerificationStatus('error');
      showError('Error de Verificación', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
 
  // Verificar el código (versión original para botón manual)
  const verifyCode = async () => {
    const codeString = code.join('');
    return verifyCodeWithString(codeString);
  };
 
  // Manejar cambios en los inputs de código
  const handleCodeChange = (text, index) => {
    // Solo permitir dígitos
    const numericValue = text.replace(/[^0-9]/g, '');
   
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);
     
      // Enfocar el siguiente input si hay texto y no es el último
      if (numericValue && index < codeLength - 1) {
        setTimeout(() => {
          inputRefs[index + 1]?.current?.focus();
        }, 50); // Pequeño delay para asegurar que el estado se actualice
      }
     
      // Limpiar mensajes de error al escribir
      setVerificationStatus(null);
      setCodeError('');
     
      // Si se completaron todos los dígitos, verificar automáticamente después de un pequeño delay
      const filledCount = newCode.filter(digit => digit !== '' && digit.trim() !== '').length;
      console.log('Campos llenos:', filledCount, 'Código:', newCode);
     
      if (filledCount === codeLength) {
        setTimeout(() => {
          // Usar el newCode actualizado en lugar del state code
          const finalCodeString = newCode.join('');
          console.log('Código final para verificación:', finalCodeString, 'Longitud:', finalCodeString.length);
          verifyCodeWithString(finalCodeString);
        }, 500); // Pequeño delay para que el usuario vea que se completó
      }
    } else if (numericValue.length > 1) {
      // Si pegan múltiples dígitos, distribuirlos en los campos
      const digits = numericValue.slice(0, codeLength).split('');
      const newCode = [...code];
     
      digits.forEach((digit, i) => {
        if (index + i < codeLength) {
          newCode[index + i] = digit;
        }
      });
     
      setCode(newCode);
     
      // Enfocar el siguiente campo disponible
      const nextIndex = Math.min(index + digits.length, codeLength - 1);
      setTimeout(() => {
        inputRefs[nextIndex]?.current?.focus();
      }, 50);
     
      // Verificar si se completó
      const filledCount = newCode.filter(digit => digit !== '' && digit.trim() !== '').length;
      if (filledCount === codeLength) {
        setTimeout(() => {
          const finalCodeString = newCode.join('');
          verifyCodeWithString(finalCodeString);
        }, 500);
      }
    }
  };
 
  // Manejar tecla borrar
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // Si el campo está vacío y se presiona borrar, ir al campo anterior
      setTimeout(() => {
        inputRefs[index - 1]?.current?.focus();
      }, 50);
    }
  };
 
  // Validar formulario cada vez que cambie el código
  const validateForm = () => {
    const codeString = code.join('');
    const isValid = codeString.length === codeLength && /^\d+$/.test(codeString);
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
      const url = isPasswordRecovery
        ? buildApiUrl(API_ENDPOINTS.RECOVERY_REQUEST)
        : buildApiUrl(API_ENDPOINTS.RESEND_CODE);
     
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userType: 'customer',
          ...(isPasswordRecovery ? {} : { isPasswordRecovery })
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
    if (code.join('').length !== codeLength) {
      setCodeError(`Por favor ingresa un código válido de ${codeLength} dígitos`);
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
            colors={['#fef7f7', '#fce7e7', '#f9a8d4']}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Elementos decorativos */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
           
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Boton de regreso */}
              <Animated.View style={[styles.backButtonContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  disabled={isLoading}
                >
                  <Ionicons name="arrow-back" size={24} color="#ec4899" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.logoContainer}>
                  <Text style={styles.brandName}>Eternal Joyería</Text>
                  <View style={styles.logoAccent} />
                </View>
                <Text style={styles.title}>Verificar Código</Text>
                <Text style={styles.subtitle}>
                  {isPasswordRecovery
                    ? 'Ingresa el código de verificación que enviamos a tu correo para restablecer tu contraseña'
                    : 'Ingresa el código de verificación que enviamos a tu correo para activar tu cuenta'
                  }
                </Text>
              </Animated.View>
 
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
              <View style={styles.codeContainer}>
                {Array.from({ length: codeLength }, (_, index) => (
                  <TextInput
                    key={`code-input-${index}`}
                    ref={(ref) => {
                      if (ref) {
                        inputRefs[index] = { current: ref };
                      }
                    }}
                    style={[
                      styles.codeInput,
                      verificationStatus === 'error' && styles.codeInputError,
                      verificationStatus === 'success' && styles.codeInputSuccess
                    ]}
                    value={code[index] || ''}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                    returnKeyType={index === codeLength - 1 ? 'done' : 'next'}
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
                  Ingresa el código de {codeLength} dígitos que enviamos a {email}
                </Text>
              )}
 
              {/* Boton de verificacion */}
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
     
      {/* Componente de alerta */}
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
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7f7',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height - 100,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ec4899',
    fontFamily: 'System',
    letterSpacing: 1,
    textShadow: '0 2px 4px rgba(236, 72, 153, 0.3)',
  },
  logoAccent: {
    width: 60,
    height: 3,
    backgroundColor: '#f472b6',
    borderRadius: 2,
    marginTop: 8,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#be185d',
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
    borderWidth: 2,
    borderColor: '#f9a8d4',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ec4899',
    backgroundColor: '#fff',
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInputFocused: {
    borderColor: '#ec4899',
    backgroundColor: '#fef7f7',
    shadowOpacity: 0.2,
  },
  codeInputError: {
    borderColor: '#e11d48',
    backgroundColor: '#fef2f2',
  },
  codeInputSuccess: {
    borderColor: '#10b981',
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
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#ec4899',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#f9a8d4',
    shadowOpacity: 0.1,
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
    color: '#ec4899',
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: '#f9a8d4',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
    zIndex: 1,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    zIndex: 1,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 300,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(249, 168, 212, 0.2)',
    zIndex: 1,
  },
});
 
export default VerifyCodeScreen;
 