import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CustomAlert = ({ 
  visible, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  title, 
  message, 
  buttons = [], 
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
  showIcon = true,
  animationType = 'bounce' // 'bounce', 'slide', 'fade'
}) => {
  console.log('CustomAlert renderizado con props:', { visible, type, title, message, buttons });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Usar requestAnimationFrame para evitar problemas de timing
      requestAnimationFrame(() => {
        // Vibración suave para alertas de error
        if (type === 'error') {
          Vibration.vibrate([0, 100, 50, 100]);
        } else if (type === 'success') {
          Vibration.vibrate(50);
        }

        // Animación de entrada
        overlayAnim.setValue(0);
        
        if (animationType === 'bounce') {
          scaleAnim.setValue(0);
          Animated.parallel([
            Animated.timing(overlayAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        } else if (animationType === 'slide') {
          slideAnim.setValue(height);
          Animated.parallel([
            Animated.timing(overlayAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 80,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          fadeAnim.setValue(0);
          Animated.parallel([
            Animated.timing(overlayAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }

        // Auto close
        if (autoClose) {
          setTimeout(() => {
            handleClose();
          }, autoCloseDelay);
        }
      });
    }
  }, [visible]);

  const handleClose = () => {
    console.log('CustomAlert handleClose llamado');
    // Vibración suave al cerrar
    Vibration.vibrate(50);
    
    if (onClose) {
      console.log('Ejecutando onClose callback');
      onClose();
    }
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#ffffff',
          icon: 'checkmark-circle',
          iconColor: '#ffffff',
          iconBackgroundColor: '#4CAF50',
          titleColor: '#333333',
          messageColor: '#666666',
          buttonColor: '#e91e63',
          buttonTextColor: '#ffffff',
        };
      case 'error':
        return {
          backgroundColor: '#ffffff',
          icon: 'close-circle',
          iconColor: '#ffffff',
          iconBackgroundColor: '#f44336',
          titleColor: '#333333',
          messageColor: '#666666',
          buttonColor: '#6366f1',
          buttonTextColor: '#ffffff',
        };
      case 'warning':
        return {
          backgroundColor: '#ffffff',
          icon: 'warning-outline',
          iconColor: '#ffffff',
          iconBackgroundColor: '#ffc107',
          titleColor: '#333333',
          messageColor: '#666666',
          buttonColor: '#ffc107',
          buttonTextColor: '#ffffff',
        };
      default:
        return {
          backgroundColor: '#ffffff',
          icon: 'information-circle',
          iconColor: '#ffffff',
          iconBackgroundColor: '#2196f3',
          titleColor: '#333333',
          messageColor: '#666666',
          buttonColor: '#2196f3',
          buttonTextColor: '#ffffff',
        };
    }
  };

  const config = getAlertConfig();

  const getAnimatedStyle = () => {
    if (animationType === 'bounce') {
      return {
        transform: [{ scale: scaleAnim }],
      };
    } else if (animationType === 'slide') {
      return {
        transform: [{ translateY: slideAnim }],
      };
    } else {
      return {
        opacity: fadeAnim,
      };
    }
  };

  if (!visible) {
    console.log('CustomAlert no visible, retornando null');
    return null;
  }

  console.log('CustomAlert visible, renderizando con View absoluto...');
  return (
    <View style={[styles.overlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 1 }]}>
      <TouchableWithoutFeedback onPress={() => console.log('Fondo presionado, pero no cerrando')}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.alertContainer, getAnimatedStyle(), { backgroundColor: config.backgroundColor }]}>
              <View style={styles.alertContent}>
                {showIcon && (
                  <View style={[styles.iconContainer, { backgroundColor: config.iconBackgroundColor }]}>
                    <Ionicons 
                      name={config.icon} 
                      size={32} 
                      color={config.iconColor} 
                    />
                  </View>
                )}
                
                {title && (
                  <Text style={[styles.alertTitle, { color: config.titleColor }]}>{title}</Text>
                )}
                
                {message && (
                  <Text style={[styles.alertMessage, { color: config.messageColor }]}>{message}</Text>
                )}
                
                {/* Botones de accion */}
                <View style={styles.buttonsContainer}>
                  {buttons.length > 0 ? (
                    // Botones personalizados
                    buttons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.button,
                          { backgroundColor: config.buttonColor }
                        ]}
                        onPress={() => {
                          if (button.onPress) button.onPress();
                          handleClose();
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.buttonText, { color: config.buttonTextColor }]}>
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    // Botón de cerrar por defecto
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: config.buttonColor }]}
                      onPress={handleClose}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buttonText, { color: config.buttonTextColor }]}>OK</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
    elevation: 9999,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 350,
    minWidth: 280,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  alertContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomAlert;
