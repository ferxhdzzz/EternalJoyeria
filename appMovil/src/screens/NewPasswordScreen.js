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
import { useNavigation } from '@react-navigation/native';

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
    
    // Validar contraseña
    if (!newPassword) {
      setPasswordError('La contraseña es requerida');
      valid = false;
    } else if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      valid = false;
    } else {
      setPasswordError('');
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
      const response = await fetch('http://192.168.1.200:4000/api/recovery-password/new-password', {
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
      Alert.alert(
        '¡Contraseña actualizada!',
        'Tu contraseña ha sido actualizada correctamente. Por favor inicia sesión con tu nueva contraseña.',
        [
          { 
            text: 'Aceptar', 
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          }
        ]
      );
      
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar navegación hacia atrás
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.background}
          >
            {/* Botón de regreso */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleGoBack}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
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
            {/* Campo de nueva contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <View style={[
                styles.inputWrapper,
                passwordError ? styles.inputError : null
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onBlur={validateForm}
                />
                <TouchableOpacity 
                  style={styles.visibilityIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color="#666" 
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
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onBlur={validateForm}
                />
                <TouchableOpacity 
                  style={styles.visibilityIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : (
                <Text style={styles.hintText}>
                  La contraseña debe tener al menos 6 caracteres
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
      </LinearGradient>
    </SafeAreaView>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    paddingRight: 10,
  },
  visibilityIcon: {
    padding: 5,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },
  hintText: {
    color: '#666',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#d4af37',
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NewPasswordScreen;
