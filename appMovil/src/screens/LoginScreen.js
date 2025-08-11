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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Referencias para las animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animación de entrada suave para complementar la transición
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

  const handleLogin = () => {
    validateForm();
    if (isFormValid) {
      console.log('Iniciando sesión con:', email, password);
      // Simular datos de usuario para la demo
      const mockUserData = {
        firstName: 'Usuario',
        lastName: 'Demo',
        email: email,
      };
      // Navegar a la pantalla de productos
      navigation.navigate('Products', mockUserData);
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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Botón de regreso con animación */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Sección superior rosa con curva cóncava */}
        <Animated.View style={[styles.topSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={['#FFFFFF', '#FFE7E7']}
            style={styles.pinkGradient}
          >
            {/* Curva cóncava */}
            <View style={styles.curveContainer}>
              <View style={styles.curve} />
            </View>
            
            {/* Texto de bienvenida */}
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Bienvenido</Text>
              <Text style={styles.welcomeDescription}>
                ¡Encuentra tus accesorios perfectos!{'\n'}
                Nos encanta tenerte aquí de nuevo.{'\n'}
                Inicia sesión para continuar{'\n'}
                comprando nuestras joyas.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Sección inferior blanca con animación del formulario */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo</Text>
              <TextInput
                style={[styles.textInput, emailError ? styles.inputError : null]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordTextInput, passwordError ? styles.inputError : null]}
                  placeholder="***********"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIconButton} 
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* Enlace de registro */}
            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                ¿Aún no tienes cuenta? <Text style={styles.registerHighlight}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de inicio de sesión */}
          <TouchableOpacity 
            style={[styles.loginButton, !isFormValid ? styles.loginButtonDisabled : null]} 
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  topSection: {
    height: height * 0.4,
    position: 'relative',
  },
  pinkGradient: {
    flex: 1,
    position: 'relative',
  },
  curveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  welcomeTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 100,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordTextInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#2c3e50',
    flex: 1,
  },
  eyeIconButton: {
    position: 'absolute',
    right: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  registerHighlight: {
    color: '#E8B4B4',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginTop: 60,
    alignSelf: 'center',
    borderRadius: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen; 