import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = ({ navigation, route }) => {
  const { email, code } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Referencias para las animaciones de entrada
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

  // Validar nueva contraseña
  const validateNewPassword = (password) => {
    if (!password) {
      setNewPasswordError('La nueva contraseña es requerida');
      return false;
    } else if (password.length < 6) {
      setNewPasswordError('La contraseña debe tener al menos 6 caracteres');
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
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    setIsFormValid(isNewPasswordValid && isConfirmPasswordValid);
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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async () => {
    validateForm();
    if (isFormValid) {
      setIsLoading(true);
      try {
        // Aquí iría la llamada al backend para cambiar la contraseña
        // Por ahora simulamos el cambio
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert(
          '¡Contraseña cambiada!',
          'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
          [
            {
              text: 'Ir al login',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'No se pudo cambiar la contraseña. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
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
              <Text style={styles.welcomeTitle}>Nueva contraseña</Text>
              <Text style={styles.welcomeDescription}>
                Estás a un paso de{'\n'}
                recuperar tu cuenta.{'\n'}
                Crea una nueva contraseña{'\n'}
                segura y fácil de recordar.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Sección inferior blanca con animación del formulario */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Nueva Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nueva contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordTextInput, newPasswordError ? styles.inputError : null]}
                  placeholder="***********"
                  placeholderTextColor="#666"
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  onBlur={() => validateNewPassword(newPassword)}
                  secureTextEntry={!showNewPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIconButton} 
                  onPress={toggleNewPasswordVisibility}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showNewPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
            </View>

            {/* Campo Confirmar Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordTextInput, confirmPasswordError ? styles.inputError : null]}
                  placeholder="***********"
                  placeholderTextColor="#666"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIconButton} 
                  onPress={toggleConfirmPasswordVisibility}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            {/* Información adicional */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Asegúrate de que tu nueva contraseña sea segura y fácil de recordar. Debe tener al menos 6 caracteres.
              </Text>
            </View>
          </View>

          {/* Botón de cambiar contraseña */}
          <TouchableOpacity 
            style={[styles.changePasswordButton, !isFormValid || isLoading ? styles.changePasswordButtonDisabled : null]} 
            onPress={handleChangePassword}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.changePasswordButtonText}>
              {isLoading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
            </Text>
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
    fontSize: 28,
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
});

export default ChangePasswordScreen;
