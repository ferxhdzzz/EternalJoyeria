import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen2 = ({ onNext }) => {
  // Referencias para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.8)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Animación de entrada con fade y slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    // Animación de salida antes de navegar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onNext) {
        onNext();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={styles.imageSection}>
          <LinearGradient
            colors={['#f8bbd9', '#f48fb1', '#e91e63']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View 
              style={[
                styles.imageContainer,
                { 
                  transform: [{ translateY: slideAnim }],
                  opacity: fadeAnim 
                }
              ]}
            >
              <Image
                source={require('../../assets/welcome-images/bienvenida2.png')}
                style={styles.womanImage}
                resizeMode="cover"
              />
            </Animated.View>
          </LinearGradient>
        </View>
        <Animated.View 
          style={[
            styles.contentSection,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim 
            }
          ]}
        >
          <View style={styles.curveSeparator} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 120 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.mainTitle}>
              Joyas que cuentan{'\n'}tu historia
            </Text>
            <Text style={styles.description}>
              Cada pieza es única, como tú.{'\n'}Encuentra la joya perfecta que{'\n'}refleje tu personalidad.
            </Text>
            <View style={styles.navigationDots}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>
          </ScrollView>
          <TouchableOpacity 
            style={[styles.startButton, { bottom: Math.max(12, insets.bottom + 8) }]} 
            onPress={handleStart}
          >
            <Animated.Text style={[styles.startButtonText, { transform: [{ scale: buttonScaleAnim }] }]}>
              Comenzar
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    height: height * 0.6, // 60% de la altura
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.8, // Reducido de 0.9 a 0.8 para imagen más pequeña
    height: height * 0.45, // Reducido de 0.55 a 0.45 para imagen más pequeña
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: height * 0.12, // Aumentado de 0.1 a 0.12 para mover la imagen un poquito más abajo
    marginBottom: height * 0.05,
  },
  womanImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 80, // Reducido para que el botón no quede fuera en pantallas pequeñas
    position: 'relative',
  },
  curveSeparator: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    // Eliminadas todas las sombras y efectos para que sea totalmente blanca
  },
  mainTitle: {
    fontSize: 32, // Aumentado de 28 a 32 para letra más grande
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginTop: 20, // Reducido de 30 a 20 para mover el texto más arriba
    marginBottom: 25,
    lineHeight: 42, // Aumentado de 38 a 42 para mantener proporción
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 18, // Aumentado de 16 a 18 para letra más grande
    color: '#666',
    textAlign: 'center',
    lineHeight: 28, // Aumentado de 26 a 28 para mantener proporción
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  navigationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20, // Mover los puntos más arriba
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e91e63',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingRight: 0,
    paddingLeft: 30, // Padding solo a la izquierda para los puntos
  },
  startButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 140,
    marginRight: 0,
    marginLeft: 'auto',
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  startButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'left', 
    marginTop: 0,
    marginLeft: 0,
  },
});

export default WelcomeScreen2;