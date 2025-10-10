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
import { validatePassword, getPasswordRequirements } from '../utils/passwordValidation';

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

  const validatePasswordField = (password) => {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordError(validation.message);
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
    const isPasswordValid = validatePasswordField(password);
    
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
        if (passwordError) validatePasswordField(value);
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
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: 'rgba(255, 221, 221, 0.37)' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.scrollContent}>
              {/* Título y subtítulo */}
              <Animated.View style={[styles.titleContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {/* Flecha de regreso */}
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                
                <Text style={styles.mainTitle}>Registrarse</Text>
                <Text style={styles.subtitle}>¡Encuentra los accesorios perfectos!</Text>
                <Text style={styles.subtitle}>Es un placer tenerte aquí.</Text>
                <Text style={styles.subtitle}>Regístrate para ver nuestros</Text>
                <Text style={styles.subtitle}>productos.</Text>
              </Animated.View>

              {/* Formulario de registro */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
                {/* Campo de nombre */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <View style={[styles.inputBox, firstNameError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
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

                {/* Campo de apellido */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Apellido</Text>
                  <View style={[styles.inputBox, lastNameError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
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


                {/* Campo de correo electrónico */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo</Text>
                  <View style={[styles.inputBox, emailError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
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

                {/* Campo de teléfono */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Teléfono</Text>
                  <View style={[styles.inputBox, phoneError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
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
                      onChangeText={(text) => handleFieldChange('password', text)}
                      onBlur={() => validatePasswordField(password)}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton} 
                      onPress={togglePasswordVisibility}
                      disabled={loading}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#6b7280" 
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : (
                    <Text style={styles.hintText}>
                      Debe contener Al menos: 8 caracteres ,número y carácter especial (!@#$%^&*-_+)
                    </Text>
                  )}
                </View>

                {/* Boton de registro */}
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

                {/* Enlaces de navegacion */}
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
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 200,
    minHeight: height + 400,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  // Botón de regreso posicionado en la esquina
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  // Estilos existentes ajustados
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 0,
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
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
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
  hintText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  loginLink: {
    marginTop: 5,
  },
  loginText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  loginHighlight: {
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;