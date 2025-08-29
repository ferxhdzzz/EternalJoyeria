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
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation, route }) => {
  // Estados del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para errores de validación local
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Estados para el registro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencias para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animación de entrada
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

  // Mostrar alerta cuando hay error del servidor
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error de Registro',
        error,
        [
          {
            text: 'Intentar de nuevo',
            onPress: () => setError(null),
          },
        ]
      );
    }
  }, [error]);

  // Validaciones locales
  const validateFirstName = (firstName) => {
    if (!firstName) {
      setFirstNameError('El nombre es requerido');
      return false;
    } else if (firstName.length < 2) {
      setFirstNameError('El nombre debe tener al menos 2 caracteres');
      return false;
    } else {
      setFirstNameError('');
      return true;
    }
  };

  const validateLastName = (lastName) => {
    if (!lastName) {
      setLastNameError('El apellido es requerido');
      return false;
    } else if (lastName.length < 2) {
      setLastNameError('El apellido debe tener al menos 2 caracteres');
      return false;
    } else {
      setLastNameError('');
      return true;
    }
  };

  const validateUsername = (username) => {
    if (!username) {
      setUsernameError('El usuario es requerido');
      return false;
    } else if (username.length < 3) {
      setUsernameError('El usuario debe tener al menos 3 caracteres');
      return false;
    } else {
      setUsernameError('');
      return true;
    }
  };

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

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[0-9]{8,10}$/;
    
    if (!phone) {
      setPhoneError('El teléfono es requerido');
      return false;
    } else if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('Ingresa un teléfono válido (8-10 dígitos)');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

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
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    
    const formIsValid = isFirstNameValid && 
      isLastNameValid && 
      isEmailValid && 
      isPhoneValid && 
      isPasswordValid;
    
    setIsFormValid(formIsValid);
    return formIsValid;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        if (firstNameError) validateFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        if (lastNameError) validateLastName(value);
        break;
      case 'email':
        setEmail(value);
        if (emailError) validateEmail(value);
        break;
      case 'phone':
        setPhone(value);
        if (phoneError) validatePhone(value);
        break;
      case 'password':
        setPassword(value);
        if (passwordError) validatePassword(value);
        break;
    }
  };

  // Validar formulario cada vez que cambien los campos
  useEffect(() => {
    if (firstName || lastName || email || phone || password) {
      validateForm();
    }
  }, [firstName, lastName, email, phone, password]);

  // Función para registrar usuario
  const registerClient = async (formData) => {
    try {
      // Para Android Studio Emulador: 10.0.2.2 mapea a localhost de tu PC
      // Para iOS Simulador: localhost funciona normalmente  
      // Para dispositivo físico: usa la IP de tu red local
      const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
      
      console.log('🌐 Intentando conectar a:', baseURL);
      
      // Crear FormData para enviar datos multipart
      const form = new FormData();
      
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('phone', formData.phone);

      // TEST: Primero probar conectividad básica
      const testResponse = await fetch(`${baseURL}/`, {
        method: 'GET',
      });
      console.log('🧪 Test de conectividad:', testResponse.status);
      
      const response = await fetch(`${baseURL}/api/registerCustomers`, {
        method: 'POST',
        headers: {
          // Para FormData, no especifiques Content-Type manualmente
          // React Native lo configurará automáticamente con boundary
        },
        body: form,
        timeout: 10000, // 10 segundos de timeout
      });

      console.log('📡 Respuesta del servidor:', response.status);

      const data = await response.json();
      console.log('📄 Datos recibidos:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return { success: true, data };

    } catch (err) {
      console.error('❌ Error en registerClient:', err);
      
      // Verificar tipo de error para dar mejor feedback
      if (err.message.includes('Network request failed')) {
        throw new Error(`No se pudo conectar al servidor. Verifica que:
1. Tu servidor esté ejecutándose en puerto 4000
2. Estés usando la IP correcta (10.0.2.2 para Android Studio)
3. No tengas firewall bloqueando la conexión`);
      }
      
      throw new Error(err.message || 'Error desconocido en el registro');
    }
  };

  // Manejar registro
  const handleRegister = async () => {
    // Validar formulario localmente primero
    if (!validateForm()) {
      Alert.alert('Formulario Incompleto', 'Por favor corrige los errores antes de continuar.');
      return;
    }

    setLoading(true);
    setError(null);

    // Preparar datos del formulario
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.replace(/[\s\-\(\)]/g, ''),
    };

    try {
      const result = await registerClient(formData);
      
      if (result.success) {
        Alert.alert(
          '¡Registro Exitoso!',
          'Te hemos enviado un código de verificación a tu correo electrónico.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navegar a Products usando el callback
                const onNavigateToProducts = route.params?.onNavigateToProducts;
                if (onNavigateToProducts) {
                  onNavigateToProducts('Products', {
                    email: formData.email,
                    userData: formData
                  });
                }
              },
            },
          ]
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Animación de salida
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
            <View style={styles.curveContainer}>
              <View style={styles.curve} />
            </View>
            
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Bienvenido</Text>
              <Text style={styles.welcomeDescription}>
                ¡Encuentra tus accesorios perfectos!{'\n'}
                Es un placer tenerte aquí,{'\n'}
                Regístrate para ver nuestros{'\n'}
                productos
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Sección inferior blanca con formulario */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          <View style={styles.formContainer}>
            {/* Campo Nombre */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={[styles.textInput, firstNameError ? styles.inputError : null]}
                placeholder="Tu nombre"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={(text) => handleFieldChange('firstName', text)}
                onBlur={() => validateFirstName(firstName)}
                autoCapitalize="words"
                editable={!loading}
              />
              {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
            </View>

            {/* Campo Apellido */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={[styles.textInput, lastNameError ? styles.inputError : null]}
                placeholder="Tu apellido"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={(text) => handleFieldChange('lastName', text)}
                onBlur={() => validateLastName(lastName)}
                autoCapitalize="words"
                editable={!loading}
              />
              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
            </View>

            {/* Campo Correo */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo</Text>
              <TextInput
                style={[styles.textInput, emailError ? styles.inputError : null]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Campo Teléfono */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={[styles.textInput, phoneError ? styles.inputError : null]}
                placeholder="8 dígitos (SV) o 10 dígitos (US)"
                placeholderTextColor="#666"
                value={phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={() => validatePhone(phone)}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!loading}
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              <Text style={styles.helperText}>
                Formato: 12345678 (El Salvador) o 1234567890 (Estados Unidos)
              </Text>
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
                  onChangeText={(text) => handleFieldChange('password', text)}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity 
                  style={styles.eyeIconButton} 
                  onPress={togglePasswordVisibility}
                  disabled={loading}
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

            {/* Enlace de inicio de sesión */}
            <TouchableOpacity 
              style={styles.loginLink} 
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? <Text style={styles.loginHighlight}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de registro */}
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              (!isFormValid || loading) ? styles.registerButtonDisabled : null
            ]} 
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={[styles.registerButtonText, { marginLeft: 10 }]}>
                  Registrando...
                </Text>
              </View>
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
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
    marginBottom: 25,
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
  helperText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
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
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  loginHighlight: {
    color: '#E8B4B4',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginTop: 40,
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
  registerButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegisterScreen;