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
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import { validatePassword } from '../utils/passwordValidation';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = ({ navigation, route }) => {
  // Obtener función de cambio de contraseña del contexto
  const { changePassword } = useAuth();
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showValidationError,
    showError,
    showSuccess,
  } = useCustomAlert();
  
  // Estados para los campos del formulario
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para mensajes de error
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Estados de validación y carga
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Datos del usuario
  const { user } = route.params || {};

  // Referencias para las animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  
  // Efecto para la animación de entrada
  React.useEffect(() => {
    const animateIn = () => {
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
      ]).start();
    };

    animateIn();

    return () => {
      // Limpieza de animaciones
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      formSlideAnim.setValue(50);
    };
  }, []);

  // Efecto para la animación de entrada
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

  // Validar contraseña actual
  const validateCurrentPassword = (password) => {
    if (!password) {
      setCurrentPasswordError('La contraseña actual es requerida');
      return false;
    } else {
      setCurrentPasswordError('');
      return true;
    }
  };

  // Validar nueva contraseña usando utilidad centralizada
  const validateNewPassword = (password) => {
    if (!password) {
      setNewPasswordError('La nueva contraseña es requerida');
      return false;
    }
    
    // Usar validación centralizada
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setNewPasswordError(validation.message);
      return false;
    }
    
    // Verificar que sea diferente a la contraseña actual
    if (password === currentPassword) {
      setNewPasswordError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }
    
    setNewPasswordError('');
    return true;
  };

  // Validar confirmación de contraseña
  const validateConfirmPassword = (confirmPass) => {
    if (!confirmPass) {
      setConfirmPasswordError('Confirma tu nueva contraseña');
      return false;
    } else if (confirmPass !== newPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const isCurrentPasswordValid = validateCurrentPassword(currentPassword);
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    setIsFormValid(isCurrentPasswordValid && isNewPasswordValid && isConfirmPasswordValid);
  };

  // Manejar cambio de contraseña
  const handleChangePassword = async () => {
    console.log('🔐 [Screen] Iniciando proceso de cambio de contraseña...');
    
    // Validar formulario
    if (!validateCurrentPassword(currentPassword) || 
        !validateNewPassword(newPassword) || 
        !validateConfirmPassword(confirmPassword)) {
      const errors = {};
      if (currentPasswordError) errors.currentPassword = currentPasswordError;
      if (newPasswordError) errors.newPassword = newPasswordError;
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
      
      showValidationError(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 [Screen] Llamando a changePassword del contexto...');
      
      // Usar la función del contexto en lugar de fetch directo
      const result = await changePassword(currentPassword.trim(), newPassword.trim());
      
      console.log('🔐 [Screen] Resultado del cambio:', result);
      
      if (result.success) {
        // Limpiar campos después de éxito
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Mostrar mensaje de éxito
        showSuccess(
          '¡Contraseña Actualizada!',
          result.message || 'Tu contraseña ha sido actualizada correctamente.',
          {
            autoClose: false,
            buttons: [
              {
                text: 'Continuar',
                style: 'confirm',
                onPress: () => navigation.goBack()
              }
            ]
          }
        );
      } else {
        // Mostrar error
        showError('Error al Cambiar Contraseña', result.error || 'Ocurrió un error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('❌ [Screen] Error inesperado:', error);
      showError('Error Inesperado', 'Ocurrió un error inesperado al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en las contraseñas
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if (newPasswordError) {
      validateNewPassword(text);
    }
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      validateConfirmPassword(text);
    }
  };

  // Validar formulario cada vez que cambien las contraseñas
  React.useEffect(() => {
    if (newPassword || confirmPassword) {
      validateForm();
    }
  }, [newPassword, confirmPassword]);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <LinearGradient
      colors={['#ffeef3', '#fce4ec', '#f8bbd9']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ad1457" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="key" size={28} color="#e91e63" />
            <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 228, 236, 0.8)']}
              style={styles.formGradient}
            >
              {/* Contrasena actual */}
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons name="lock-closed" size={16} color="#e91e63" />
                  <Text style={styles.label}>Contraseña Actual</Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor="#f06292"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={(text) => {
                      setCurrentPassword(text);
                      validateCurrentPassword(text);
                    }}
                    onBlur={() => validateCurrentPassword(currentPassword)}
                    selectionColor="#e91e63"
                  />
                  <TouchableOpacity
                    onPress={toggleCurrentPasswordVisibility}
                    style={styles.toggleButton}
                  >
                    <Ionicons 
                      name={showCurrentPassword ? 'eye-off' : 'eye'} 
                      size={22} 
                      color="#e91e63" 
                    />
                  </TouchableOpacity>
                </View>
                {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
              </View>

              {/* Nueva contrasena */}
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons name="lock-open" size={16} color="#e91e63" />
                  <Text style={styles.label}>Nueva Contraseña</Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu nueva contraseña"
                    placeholderTextColor="#f06292"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      validateNewPassword(text);
                    }}
                    onBlur={() => validateNewPassword(newPassword)}
                    selectionColor="#e91e63"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.toggleButton}
                  >
                    <Ionicons 
                      name={showNewPassword ? 'eye-off' : 'eye'} 
                      size={22} 
                      color="#e91e63" 
                    />
                  </TouchableOpacity>
                </View>
                {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
              </View>

              {/* Confirmar nueva contrasena */}
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#e91e63" />
                  <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirma tu nueva contraseña"
                    placeholderTextColor="#f06292"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      validateConfirmPassword(text);
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    selectionColor="#e91e63"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.toggleButton}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? 'eye-off' : 'eye'} 
                      size={22} 
                      color="#e91e63" 
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Boton de actualizar */}
              <LinearGradient
                colors={(!isFormValid || isLoading) ? ['#f8bbd9', '#f48fb1'] : ['#e91e63', '#ad1457']}
                style={styles.submitButton}
              >
                <TouchableOpacity
                  style={styles.submitTouchable}
                  onPress={handleChangePassword}
                  disabled={!isFormValid || isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" style={styles.loadingIcon} />
                  ) : (
                    <Ionicons name="key" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Mensaje de ayuda */}
              <View style={styles.helpContainer}>
                <Ionicons name="information-circle" size={16} color="#f06292" />
                <Text style={styles.helpText}>
                  Debe contener: mayúscula, minúscula, número y carácter especial (!@#$%^&*-_+)
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

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
    </LinearGradient>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginLeft: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  formGradient: {
    padding: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '600',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: 'rgba(233, 30, 99, 0.2)',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 55,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '500',
    height: '100%',
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  toggleButton: {
    padding: 8,
  },
  errorText: {
    color: '#e91e63',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 5,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 20,
    marginTop: 30,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  loadingIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  helpText: {
    color: '#ad1457',
    fontSize: 14,
    fontWeight: '500',
  },
});
