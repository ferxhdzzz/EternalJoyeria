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
import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import { validatePassword } from '../utils/passwordValidation';

const { width, height } = Dimensions.get('window');

const NewPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, code } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showError,
    showSuccess,
  } = useCustomAlert();

  // Referencias para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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

  // Validar formulario
  const validateForm = () => {
    let valid = true;
    
    // Validar contraseña usando utilidad centralizada
    if (!newPassword) {
      setPasswordError('La contraseña es requerida');
      valid = false;
    } else {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        setPasswordError(validation.message);
        valid = false;
      } else {
        setPasswordError('');
      }
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      setConfirmPasswordError('Por favor confirma tu contraseña');
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    setIsFormValid(valid);
    return valid;
  };

  // Manejar cambio de texto
  const handlePasswordChange = (text) => {
    setNewPassword(text);
    if (passwordError) validateForm();
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (confirmPasswordError) validateForm();
  };

  // Enviar nueva contraseña al servidor
  const handleResetPassword = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.RECOVERY_RESET), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
          code,
          userType: 'customer'
        }),
        credentials: 'include' // Importante para manejar cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la contraseña');
      }
      
      // Mostrar mensaje de éxito y navegar a la pantalla de inicio de sesión
      showSuccess(
        '¡Contraseña Actualizada!',
        'Tu contraseña ha sido actualizada correctamente. Por favor inicia sesión con tu nueva contraseña.',
        {
          autoClose: false,
          buttons: [
            { 
              text: 'Iniciar Sesión', 
              style: 'confirm',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          ]
        }
      );
      
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      showError('Error al Actualizar', error.message || 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar navegación hacia atrás
  const handleGoBack = () => {
    navigation.goBack();
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
                  onPress={handleGoBack}
                  disabled={isLoading}
                >
                  <Ionicons name="arrow-back" size={24} color="#ec4899" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View 
                style={[
                  styles.header,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>EternalJoyería</Text>
                  <View style={styles.logoUnderline} />
                </View>
                <Text style={styles.title}>Establecer Nueva Contraseña</Text>
                <Text style={styles.subtitle}>Crea una nueva contraseña segura para tu cuenta</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.formContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: formSlideAnim }]
                  }
                ]}
              >
                {/* Campo de nueva contrasena */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                  <View style={[
                    styles.inputWrapper,
                    passwordError ? styles.inputError : null
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nueva contraseña"
                      placeholderTextColor="#999"
                      value={newPassword}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onBlur={validateForm}
                      multiline={false}
                      numberOfLines={1}
                      textContentType="newPassword"
                      scrollEnabled={false}
                      blurOnSubmit={true}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={22} 
                        color="#ec4899" 
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              
                  <Text style={[styles.inputLabel, { marginTop: 20 }]}>Confirmar Contraseña</Text>
                  <View style={[
                    styles.inputWrapper,
                    confirmPasswordError ? styles.inputError : null
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmar contraseña"
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={handleConfirmPasswordChange}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      onBlur={validateForm}
                      multiline={false}
                      numberOfLines={1}
                      textContentType="newPassword"
                      scrollEnabled={false}
                      blurOnSubmit={true}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={22} 
                        color="#ec4899" 
                      />
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? (
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  ) : (
                    <Text style={styles.hintText}>
                      Debe contener: mayúscula, minúscula, número y carácter especial (!@#$%^&*-_+)
                    </Text>
                  )}
                </View>

                {/* Boton de actualizar contrasena */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    (!isFormValid || isLoading) && styles.buttonDisabled
                  ]}
                  onPress={handleResetPassword}
                  disabled={!isFormValid || isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Actualizar Contraseña</Text>
                  )}
                </TouchableOpacity>
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
  header: {
    marginBottom: 40,
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ec4899',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#f472b6',
    marginTop: 5,
    borderRadius: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 2,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
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
    paddingHorizontal: 16,
    paddingVertical: 12, // Padding moderado
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height: 56, // Altura fija moderada
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingRight: 12,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false, // Elimina padding extra en Android
    lineHeight: 20, // Controla la altura de línea
  },
  visibilityIcon: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
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
  hintText: {
    color: '#718096',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#ec4899',
    borderRadius: 15,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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

export default NewPasswordScreen;
