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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = ({ navigation, route }) => {
  // Obtener función de cambio de contraseña del contexto
  const { changePassword } = useAuth();
  
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

  // Validar nueva contraseña (mínimo 6 caracteres)
  const validateNewPassword = (password) => {
    if (!password) {
      setNewPasswordError('La nueva contraseña es requerida');
      return false;
    } else if (password.length < 6) {
      setNewPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    } else if (password === currentPassword) {
      setNewPasswordError('La nueva contraseña debe ser diferente a la actual');
      return false;
    } else {
      setNewPasswordError('');
      return true;
    }
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
      Alert.alert('Error', 'Por favor completa correctamente todos los campos');
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
        Alert.alert(
          '¡Éxito!',
          result.message || 'Tu contraseña ha sido actualizada correctamente.',
          [
            {
              text: 'Aceptar',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        // Mostrar error
        Alert.alert('Error', result.error || 'Ocurrió un error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('❌ [Screen] Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado al cambiar la contraseña');
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
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          {/* Contraseña Actual */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña Actual</Text>
            <View style={styles.passwordInputContainer}>
              <Ionicons name="lock-closed" size={20} color="#E8B4CB" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  validateCurrentPassword(text);
                }}
                onBlur={() => validateCurrentPassword(currentPassword)}
                selectionColor="#E8B4CB"
              />
              <TouchableOpacity
                onPress={toggleCurrentPasswordVisibility}
                style={styles.toggleButton}
              >
                <Ionicons 
                  name={showCurrentPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#E8B4CB" 
                />
              </TouchableOpacity>
            </View>
            {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <View style={styles.passwordInputContainer}>
              <Ionicons name="lock-open" size={20} color="#E8B4CB" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nueva contraseña"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  validateNewPassword(text);
                }}
                onBlur={() => validateNewPassword(newPassword)}
                selectionColor="#E8B4CB"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.toggleButton}
              >
                <Ionicons 
                  name={showNewPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#E8B4CB" 
                />
              </TouchableOpacity>
            </View>
            {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
          </View>

          {/* Confirmar Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
            <View style={styles.passwordInputContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#E8B4CB" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validateConfirmPassword(text);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                selectionColor="#E8B4CB"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.toggleButton}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#E8B4CB" 
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Botón de Actualizar */}
          <TouchableOpacity
            style={[
              styles.submitButton, 
              (!isFormValid || isLoading) && { backgroundColor: '#F0D5DE' }
            ]}
            onPress={handleChangePassword}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
              </View>
            ) : (
              <Ionicons name="key-outline" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Text>
          </TouchableOpacity>

          {/* Mensaje de ayuda */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              La contraseña debe tener al menos 6 caracteres
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 182, 193, 0.2)',
    borderRadius: 10,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, 
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputContainer: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#E8B4CB',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  eyeIconButton: {
    position: 'absolute',
    right: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  changePasswordButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginTop: 60,
    alignSelf: 'center',
    borderRadius: 50,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePasswordButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  changePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    padding: 12,
    fontFamily: 'Poppins-Regular',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  toggleButton: {
    padding: 5,
  },
  submitButton: {
    backgroundColor: '#E8B4CB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    marginRight: 10,
  },
  helpText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
