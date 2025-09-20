import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Mejor comportamiento en Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={['#fdf2f8', '#fce7f3', '#f3e8ff']}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative elements - optimizados */}
            {isAnimationComplete && (
              <>
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />
              </>
            )}
            
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              contentInsetAdjustmentBehavior="automatic"
              bounces={false} // Evitar rebote excesivo
            >

              {/* Header con logo */}
              <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>Eternal Joyería</Text>
                  <View style={styles.logoUnderline} />
                </View>
                <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Inicia sesión para descubrir nuestras joyas exclusivas
                </Text>
              </Animated.View>

              {/* Formulario */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
                {/* Campo Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo Electrónico</Text>
                  <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                    <Ionicons name="mail-outline" size={20} color="#c084fc" style={styles.inputIcon} />
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

                {/* Campo Contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#c084fc" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ingresa tu contraseña"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={handlePasswordChange}
                      onBlur={() => validatePassword(password)}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconButton}
                      onPress={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#c084fc"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                {/* Botón de inicio de sesión */}
                <TouchableOpacity
                  style={[styles.loginButton, !isFormValid || isLoading ? styles.loginButtonDisabled : null]}
                  onPress={handleLogin}
                  disabled={!isFormValid || isLoading}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Text>
                </TouchableOpacity>

                {/* Enlaces */}
                <View style={styles.linksContainer}>
                  <TouchableOpacity style={styles.forgotPasswordLink} onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>
                      ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Alerta personalizada para errores */}
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
    backgroundColor: '#fdf2f8',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Centrar contenido verticalmente
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30, // Reducido el margen inferior
    zIndex: 2,
    marginTop: Platform.OS === 'ios' ? 0 : 20, // Ajuste para iOS/Android
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20, // Reducido el margen inferior
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#c084fc',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#f472b6',
    marginTop: 5,
    borderRadius: 2,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7c2d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#9333ea',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20, // Reducido el margen superior e inferior
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#c084fc',
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
    color: '#7c2d92',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#f472b6',
    paddingHorizontal: 15,
    height: 56,
    shadowColor: '#c084fc',
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
    color: '#1e293b',
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
    fontWeight: '500',
  },
  eyeIconButton: {
    padding: 5,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordLink: {
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#c084fc',
    textAlign: 'center',
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 10,
  },
  registerText: {
    fontSize: 16,
    color: '#9333ea',
    textAlign: 'center',
  },
  registerHighlight: {
    color: '#c084fc',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#c084fc',
    borderRadius: 15,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    top: -50,
    right: -50,
    zIndex: 0,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    bottom: -100,
    left: -100,
    zIndex: 0,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    top: '30%',
    right: -50,
    zIndex: 0,
  },
});

export default LoginScreen;