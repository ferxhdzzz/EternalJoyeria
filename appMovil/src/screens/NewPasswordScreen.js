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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import { validatePassword } from '../utils/passwordValidation';

const { width, height } = Dimensions.get('window');

const NewPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, code, token } = route.params;
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
      // Obtener el token de los parámetros de navegación o de AsyncStorage
      let recoveryToken = token; // Primero intentar con el parámetro
      
      if (!recoveryToken) {
        // Si no viene en parámetros, buscar en AsyncStorage
        recoveryToken = await AsyncStorage.getItem('recoveryToken');
      }
      
      if (!recoveryToken) {
        throw new Error('No se encontró token de recuperación.');
      }
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.RECOVERY_RESET), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${recoveryToken}` // Enviar token en header
        },
        body: JSON.stringify({
          newPassword
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


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* Header con logo y titulo */}
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
                <Text style={styles.logoText}>Eternal Joyería</Text>
                <View style={styles.logoUnderline} />
              </View>
              <Text style={styles.title}>Establecer Nueva Contraseña</Text>
              <Text style={styles.subtitle}>Crea una nueva contraseña segura para tu cuenta</Text>
            </Animated.View>

            {/* Formulario de contraseña */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: formSlideAnim }]
                }
              ]}
            >
              {/* Campo de nueva contraseña */}
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
                      color="#000" 
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
                      color="#000" 
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : (
                  <Text style={styles.hintText}>
                    Debe contener Al menos: 8 caracteres ,número y carácter especial (!@#$%^&*-_+)
                  </Text>
                )}
              </View>

              {/* Botón de actualizar contraseña */}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height - 100,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f48fb1',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#f48fb1',
    marginTop: 8,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d2d2d',
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  visibilityIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 5,
  },
  hintText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewPasswordScreen;
