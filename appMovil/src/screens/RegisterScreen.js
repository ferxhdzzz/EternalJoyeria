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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useRegistro from '../hooks/Register/useRegistro';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

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

  // Hook de registro
  const { registerClient, loading, error } = useRegistro();
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showError,
    showSuccess,
  } = useCustomAlert();

  // Referencias para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef(null);

  // Estado para el teclado
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

    // Listeners del teclado para mejorar el scroll
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Mostrar alerta cuando hay error del servidor
  useEffect(() => {
    if (error) {
      showError(
        'Error de Registro',
        error
        // Usar botón de cerrar por defecto
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

  // Función para filtrar solo números en el teléfono
  const handlePhoneChange = (text) => {
    // Solo permitir números
    const numericValue = text.replace(/[^0-9]/g, '');
    handleFieldChange('phone', numericValue);
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


  // Manejar registro
  const handleRegister = async () => {
    // Validar formulario localmente primero
    if (!validateForm()) {
      const errors = {};
      if (firstNameError) errors.firstName = firstNameError;
      if (lastNameError) errors.lastName = lastNameError;
      if (emailError) errors.email = emailError;
      if (phoneError) errors.phone = phoneError;
      if (passwordError) errors.password = passwordError;
      
      showValidationError(errors);
      return;
    }


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
        showSuccess(
          '¡Registro Exitoso!',
          'Te hemos enviado un código de verificación a tu correo electrónico.',
          {
            autoClose: false,
            buttons: [
              {
                text: 'Verificar Código',
                style: 'confirm',
                onPress: () => {
                  navigation.navigate('VerifyCode', { 
                    email: formData.email,
                    onNavigateToProducts: route.params?.onNavigateToProducts
                  });
                },
              },
            ]
          }
        );
      } else {
        showError('Error de Registro', result.error || 'Ocurrió un error durante el registro.');
      }
    } catch (err) {
      showError('Error Inesperado', 'Ocurrió un error inesperado. Por favor intenta de nuevo.');
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
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={styles.background}
            colors={['#fdf2f8', '#fce7f3', '#f3e8ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Círculos decorativos */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
            
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={[
                styles.scrollContainer,
                { paddingBottom: Math.max(150, keyboardHeight + 50) }
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              bounces={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              contentInsetAdjustmentBehavior="automatic"
              automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            >
              {/* Botón de regreso con animación */}
              <Animated.View style={[styles.backButtonContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#c084fc" />
                </TouchableOpacity>
              </Animated.View>

              {/* Header con logo */}
              <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>Eternal Joyería</Text>
                  <View style={styles.logoUnderline} />
                </View>
                <Text style={styles.welcomeTitle}>¡Únete a nosotros!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Crea tu cuenta y descubre joyas únicas
                </Text>
              </Animated.View>

              {/* Formulario */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
                {/* Campo Nombre */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <View style={[styles.inputWrapper, firstNameError ? styles.inputError : null]}>
                    <Ionicons name="person-outline" size={20} color="#0891b2" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Tu nombre"
                      placeholderTextColor="#999"
                      value={firstName}
                      onChangeText={(text) => handleFieldChange('firstName', text)}
                      onBlur={() => validateFirstName(firstName)}
                      autoCapitalize="words"
                      editable={!loading}
                    />
                  </View>
                  {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                </View>

                {/* Campo Apellido */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Apellido</Text>
                  <View style={[styles.inputWrapper, lastNameError ? styles.inputError : null]}>
                    <Ionicons name="person-outline" size={20} color="#0891b2" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Tu apellido"
                      placeholderTextColor="#999"
                      value={lastName}
                      onChangeText={(text) => handleFieldChange('lastName', text)}
                      onBlur={() => validateLastName(lastName)}
                      autoCapitalize="words"
                      editable={!loading}
                    />
                  </View>
                  {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                </View>

                {/* Campo Correo */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo Electrónico</Text>
                  <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                    <Ionicons name="mail-outline" size={20} color="#c084fc" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={(text) => handleFieldChange('email', text)}
                      onBlur={() => validateEmail(email)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                {/* Campo Teléfono */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Teléfono</Text>
                  <View style={[styles.inputWrapper, phoneError ? styles.inputError : null]}>
                    <Ionicons name="call-outline" size={20} color="#c084fc" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Números (8-10 dígitos)"
                      placeholderTextColor="#999"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      onBlur={() => validatePhone(phone)}
                      keyboardType="numeric"
                      maxLength={10}
                      editable={!loading}
                    />
                  </View>
                  {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                  <Text style={styles.helperText}>
                    Ej: 12345678 (SV) o 1234567890 (US)
                  </Text>
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#c084fc" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Mínimo 8 caracteres"
                      placeholderTextColor="#999"
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
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#c084fc" 
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                  )}
                </TouchableOpacity>

                {/* Enlaces */}
                <View style={styles.linksContainer}>
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
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Alerta personalizada */}
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
    backgroundColor: '#f0f9ff',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 150, // Más espacio para el teclado
    paddingTop: 80,
    minHeight: height * 0.9, // Asegurar altura mínima para scroll
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginTop: 20,
    paddingBottom: 60, // Más espacio en la parte inferior
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 2,
    marginBottom: 40, // Margen inferior adicional
  },
  inputContainer: {
    marginBottom: 20, // Más espacio entre campos
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c2d92',
    marginBottom: 8,
    marginLeft: 5,
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
    paddingRight: 10, // Espacio a la derecha del texto
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
  helperText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  eyeIconButton: {
    padding: 5,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#9333ea',
    textAlign: 'center',
  },
  loginHighlight: {
    color: '#c084fc',
    fontWeight: '600',
  },
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    zIndex: 1,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 300,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(196, 181, 253, 0.2)',
    zIndex: 1,
  },
});

export default RegisterScreen;