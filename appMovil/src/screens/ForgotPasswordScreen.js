import React, { useState, useRef, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showError,
    showSuccess,
    showInfo,
  } = useCustomAlert();

  // Referencias para las animaciones de entrada - optimizadas
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(0)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    // Animación de entrada optimizada
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]);
    
    const timer = setTimeout(() => {
      animation.start(() => setIsAnimationComplete(true));
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El correo es requerido');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Ingresa un correo válido');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    setIsFormValid(isEmailValid);
  };

  // Manejar cambios en el email
  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  // Validar formulario cada vez que cambie el email
  useEffect(() => {
    if (email) {
      validateForm();
    }
  }, [email]);

  const handleSendCode = async () => {
    validateForm();
    if (isFormValid) {
      setIsLoading(true);
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.RECOVERY_REQUEST), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            userType: 'customer'
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al enviar el código de verificación');
        }

        // Guardar el token de recuperación si viene en la respuesta
        if (data.recoveryToken) {
          await AsyncStorage.setItem('recoveryToken', data.recoveryToken);
        }

        showSuccess(
          '¡Código Enviado!',
          'Hemos enviado un código de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y carpeta de spam.',
          {
            autoClose: false,
            buttons: [
              {
                text: 'Verificar Código',
                style: 'confirm',
                onPress: () => {
                  navigation.navigate('VerifyCode', {
                    email: email.trim(),
                    isPasswordRecovery: true,
                  });
                },
              },
            ]
          }
        );
      } catch (error) {
        console.error('Error al solicitar código:', error);
        showError(
          'Error al Enviar Código',
          error.message || 'No se pudo enviar el código de recuperación. Verifica tu conexión e inténtalo nuevamente.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      const errors = {};
      if (emailError) errors.email = emailError;
      
      showValidationError(errors);
    }
  };

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background}>
            {/* Header limpio */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
                </View>
                <View style={styles.headerSpacer} />
              </View>
            </View>
            
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Contenido principal */}
              <View style={styles.contentContainer}>
                <Text style={styles.subtitle}>
                  Ingresa tu correo electrónico para recibir un código de recuperación
                </Text>

              {/* Formulario de recuperacion */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
                {/* Campo de correo electronico */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo Electrónico</Text>
                  <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                    <Ionicons name="mail-outline" size={20} color="#000000" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={handleEmailChange}
                      onBlur={() => validateEmail(email)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                {/* Informacion adicional */}
                <View style={styles.infoContainer}>
                  <Ionicons name="information-circle-outline" size={20} color="#000000" style={styles.infoIcon} />
                  <Text style={styles.infoText}>
                    Te enviaremos un código de verificación a tu correo electrónico para que puedas cambiar tu contraseña de forma segura.
                  </Text>
                </View>

                {/* Boton de enviar codigo */}
                <TouchableOpacity 
                  style={[
                    styles.sendCodeButton, 
                    (!isFormValid || isLoading) ? styles.sendCodeButtonDisabled : null
                  ]} 
                  onPress={handleSendCode}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={[styles.sendCodeButtonText, { marginLeft: 10 }]}>
                        Enviando código...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.sendCodeButtonText}>Enviar Código</Text>
                  )}
                </TouchableOpacity>

                {/* Enlaces de navegacion */}
                <View style={styles.linksContainer}>
                  <TouchableOpacity 
                    style={styles.backToLoginLink} 
                    onPress={() => navigation.goBack()}
                    disabled={isLoading}
                  >
                    <Text style={styles.backToLoginText}>
                      ¿Recordaste tu contraseña? <Text style={styles.backToLoginHighlight}>Iniciar sesión</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
              </View>
            </ScrollView>
          </View>
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
    backgroundColor: 'rgba(255, 221, 221, 0.37)', // Fondo rosa pastel con 37% opacidad
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000', // Texto negro
  },
  headerSpacer: {
    width: 45,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000', // Texto negro
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#FFB6C1', // Rosa pastel
    marginTop: 5,
    borderRadius: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000', // Texto negro
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFB6C1', // Contorno rosa pastel
    paddingHorizontal: 15,
    height: 56,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000', // Texto negro
    paddingRight: 10,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputError: {
    borderColor: '#e53e3e',
    backgroundColor: '#fed7d7',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFB6C1', // Fondo rosa pastel
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB6C1', // Contorno rosa pastel
    marginBottom: 25,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#000000', // Texto negro
    lineHeight: 20,
  },
  sendCodeButton: {
    backgroundColor: '#000000', // Fondo negro
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#ddd',
    shadowOpacity: 0.1,
  },
  sendCodeButtonText: {
    color: '#FFFFFF', // Texto blanco
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  backToLoginLink: {
    paddingVertical: 10,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#000000', // Texto negro
    textAlign: 'center',
  },
  backToLoginHighlight: {
    color: '#000000', // Texto negro
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 182, 193, 0.1)', // Rosa pastel
    top: -50,
    right: -50,
    zIndex: 0,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 182, 193, 0.1)', // Rosa pastel
    bottom: -100,
    left: -100,
    zIndex: 0,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 182, 193, 0.1)', // Rosa pastel
    top: '30%',
    right: -50,
    zIndex: 0,
  },
});

export default ForgotPasswordScreen;
