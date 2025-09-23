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
          colors: ['#4CAF50', '#2E7D32'],
          icon: 'checkmark-circle',
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          colors: ['#F44336', '#C62828'],
          icon: 'close-circle',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          colors: ['#FF9800', '#F57C00'],
          icon: 'warning',
          iconColor: '#FFFFFF',
        };
      default:
        return {
          colors: ['#e91e63', '#ad1457'],
          icon: 'information-circle',
          iconColor: '#FFFFFF',
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
            <View style={[styles.alertContainer]}>
              <LinearGradient
                colors={config.colors}
                style={styles.alertGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Circulos decorativos */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                
                <View style={styles.alertContent}>
                  {showIcon && (
                    <Animated.View style={[styles.iconContainer, { 
                      transform: [{ 
                        rotate: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        })
                      }] 
                    }]}>
                      <Ionicons 
                        name={config.icon} 
                        size={50} 
                        color={config.iconColor} 
                      />
                    </Animated.View>
                  )}
                  
                  {title && (
                    <Text style={styles.alertTitle}>{title}</Text>
                  )}
                  
                  {message && (
                    <Text style={styles.alertMessage}>{message}</Text>
                  )}
                  
                  {/* Botones de accion */}
                  <View style={[
                    styles.buttonsContainer,
                    buttons.length === 3 && styles.threeButtonsContainer
                  ]}>
                    {buttons.length > 0 ? (
                      // Botones personalizados
                      buttons.map((button, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.button,
                            button.style === 'cancel' ? styles.cancelButton : styles.confirmButton,
                            buttons.length === 1 && styles.singleButton,
                            buttons.length === 3 && styles.threeButtonsStyle,
                          ]}
                          onPress={() => {
                            if (button.onPress) button.onPress();
                            handleClose();
                          }}
                          activeOpacity={0.8}
                          underlayColor="transparent"
                          background={null}
                        >
                          <Text style={[
                            styles.buttonText,
                            button.style === 'cancel' ? styles.cancelButtonText : styles.confirmButtonText,
                          ]}>
                            {button.text}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      // Botón de cerrar por defecto
                      <TouchableOpacity
                        style={[styles.button, styles.closeButton, styles.singleButton]}
                        onPress={handleClose}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </View>
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
    width: '95%',
    maxWidth: 420,
    minWidth: 320,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  alertGradient: {
    paddingTop: 30,
    paddingHorizontal: 25,
    paddingBottom: 25,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  alertContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    paddingHorizontal: 2,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 25,
    flex: 1,
    maxWidth: 130,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  singleButton: {
    minWidth: 150,
    flex: 0,
    maxWidth: 200,
    alignSelf: 'center',
  },
  confirmButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: null,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderStyle: 'solid',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
    textAlign: 'center',
    lineHeight: 14,
    flexWrap: 'wrap',
  },
  confirmButtonText: {
    color: '#2C3E50',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    borderColor: 'transparent',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  threeButtonsContainer: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'stretch',
  },
  threeButtonsStyle: {
    flex: 0,
    minWidth: '100%',
    maxWidth: '100%',
    marginHorizontal: 0,
  },
});

export default CustomAlert;
