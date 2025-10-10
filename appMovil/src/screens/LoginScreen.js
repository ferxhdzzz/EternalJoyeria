import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showError,
    showSuccess,
    showLoginSuccess,
    showAlert,
  } = useCustomAlert();

  // Referencias para las animaciones de entrada - optimizadas
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current; // Iniciar en 0 para evitar saltos
  const formSlideAnim = useRef(new Animated.Value(0)).current; // Iniciar en 0 para evitar saltos
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    // Animación de entrada optimizada
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300, // Reducir la duración para mayor fluidez
        useNativeDriver: true,
      })
    ]);
    
    // Iniciar la animación con un pequeño retraso
    const timer = setTimeout(() => {
      animation.start(() => setIsAnimationComplete(true));
    }, 50);
    
    // Limpiar el temporizador al desmontar
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

  // Validar contraseña
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('La contraseña debe contener al menos un carácter especial');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  // Manejar cambios en el email
  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  // Manejar cambios en la contraseña
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
  };

  // Validar formulario cada vez que cambien los campos
  useEffect(() => {
    if (email || password) {
      validateForm();
    }
  }, [email, password]);


  // Función de login corregida para tu arquitectura
  const handleLogin = async () => {
    console.log('Iniciando proceso de login...');
    console.log('Email:', email);
    console.log('Formulario válido:', isFormValid);
    
    validateForm();
    if (isFormValid) {
      setIsLoading(true);
      try {
        console.log('Llamando a login del AuthContext...');
        const result = await login(email, password);
        
        console.log('Resultado del login:', result);
        
        if (result.success) {
          console.log('Login exitoso, mostrando alerta...');
          console.log('Usuario logueado:', result.user);
          
          // Mostrar mensaje de éxito primero
          const userName = result.user.name || result.user.firstName || '';
          console.log('Mostrando alerta de login exitoso para:', userName);
          
          // Navegar directamente sin alerta
          const onNavigateToProducts = route?.params?.onNavigateToProducts;
          if (onNavigateToProducts) {
            console.log('Navegando directamente a Products...');
            onNavigateToProducts('Products', result.user);
          }
          
        } else {
          console.log('Error de login:', result.error);
          showError('Error de Inicio de Sesión', result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } catch (error) {
        console.error('Error inesperado en login:', error);
        showError('Error Inesperado', 'Ocurrió un problema al iniciar sesión. Por favor intenta nuevamente.');
      } finally {
        setIsLoading(false);
        console.log('Proceso de login terminado');
      }
    } else {
      console.log('Formulario no válido');
      console.log('Error email:', emailError);
      console.log('Error password:', passwordError);
      
      const errors = {};
      if (emailError) errors.email = emailError;
      if (passwordError) errors.password = passwordError;
      
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              bounces={true}
              scrollEnabled={true}
            >
              {/* Contenedor de título */}
              <Animated.View style={[styles.titleContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.mainTitle}>Iniciar sesión</Text>
                <Text style={styles.subtitle}>¡Encuentra tus accesorios perfectos!</Text>
                <Text style={styles.subtitle}>Es un placer tenerte aquí.</Text>
                <Text style={styles.subtitle}>Regístrate para ver nuestros</Text>
                <Text style={styles.subtitle}>productos.</Text>
              </Animated.View>

              {/* Formulario */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
                {/* Campo de correo */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo</Text>
                  <View style={[styles.inputBox, emailError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
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

                {/* Campo de contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={[styles.inputBox, passwordError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={handlePasswordChange}
                      onBlur={() => validatePassword(password)}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={togglePasswordVisibility}
                      disabled={isLoading}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#6b7280" 
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                {/* Enlace de contraseña olvidada */}
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón de iniciar sesión */}
                <TouchableOpacity 
                  style={[
                    styles.loginButton, 
                    (!isFormValid || isLoading) ? styles.loginButtonDisabled : null
                  ]} 
                  onPress={handleLogin}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Iniciando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                  )}
                </TouchableOpacity>

                {/* Enlace de registro */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
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
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 150,
    minHeight: height * 1.2,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    marginHorizontal: 0,
    backgroundColor: '#fdf2f8',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 2,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 6,
  },
  inputBox: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingLeft: 16,
    paddingRight: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 0,
    height: '100%',
  },
  eyeButton: {
    padding: 8,
    marginLeft: -4,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  registerText: {
    fontSize: 13,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;