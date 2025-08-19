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

const VerifyCodeScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
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

  // Validar código
  const validateCode = (code) => {
    if (!code) {
      setCodeError('El código es requerido');
      return false;
    } else if (code.length < 4) {
      setCodeError('El código debe tener al menos 4 dígitos');
      return false;
    } else {
      setCodeError('');
      return true;
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const isCodeValid = validateCode(code);
    setIsFormValid(isCodeValid);
  };

  // Manejar cambios en el código
  const handleCodeChange = (text) => {
    setCode(text);
    if (codeError) {
      validateCode(text);
    }
  };

  // Validar formulario cada vez que cambie el código
  React.useEffect(() => {
    if (code) {
      validateForm();
    }
  }, [code]);

  const handleVerifyCode = async () => {
    validateForm();
    if (isFormValid) {
      setIsLoading(true);
      try {
        // Aquí iría la llamada al backend para verificar el código
        // Por ahora simulamos la verificación
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert(
          'Código verificado',
          'Tu código ha sido verificado correctamente. Ahora puedes cambiar tu contraseña.',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('ChangePassword', { email, code })
            }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'El código no es válido. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      // Aquí iría la llamada al backend para reenviar el código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Código reenviado',
        'Se ha reenviado un nuevo código a tu correo electrónico.'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo reenviar el código. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
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
              <Text style={styles.welcomeTitle}>Verificar código</Text>
              <Text style={styles.welcomeDescription}>
                Hemos enviado un código de{'\n'}
                verificación a tu correo.{'\n'}
                Ingresa el código para{'\n'}
                continuar con la{'\n'}
                recuperación.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Sección inferior blanca con animación del formulario */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Código */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Código de verificación</Text>
              <TextInput
                style={[styles.textInput, codeError ? styles.inputError : null]}
                placeholder="1234"
                placeholderTextColor="#666"
                value={code}
                onChangeText={handleCodeChange}
                onBlur={() => validateCode(code)}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
              />
              {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
            </View>

            {/* Información adicional */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Revisa tu correo electrónico y ingresa el código de 4-6 dígitos que recibiste.
              </Text>
            </View>

            {/* Enlace para reenviar código */}
            <TouchableOpacity style={styles.resendLink} onPress={handleResendCode}>
              <Text style={styles.resendText}>
                ¿No recibiste el código? <Text style={styles.resendHighlight}>Reenviar</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de verificar código */}
          <TouchableOpacity 
            style={[styles.verifyButton, !isFormValid || isLoading ? styles.verifyButtonDisabled : null]} 
            onPress={handleVerifyCode}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? 'Verificando...' : 'Verificar código'}
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
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#2c3e50',
    textAlign: 'center',
    letterSpacing: 8,
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
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resendLink: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendHighlight: {
    color: '#E8B4B4',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VerifyCodeScreen;
