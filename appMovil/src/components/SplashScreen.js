import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // Referencias para las animaciones mejoradas
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada del fondo con efecto de expansión
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Animación de entrada del logo con rotación y escala
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animación de partículas flotantes
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle1, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle1, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.delay(1000),
            Animated.timing(particle2, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle2, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.delay(2000),
            Animated.timing(particle3, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle3, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]).start();

    // Animación de pulsación del logo
    Animated.sequence([
      Animated.delay(2000),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Efecto de brillo/glow
    Animated.sequence([
      Animated.delay(1500),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Animación de entrada del texto con efecto de escritura
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(textSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Timer para cerrar el splash screen
    const timer = setTimeout(() => {
      // Animación de salida mejorada
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Interpolaciones para efectos especiales
  const logoRotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particle1Transform = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const particle2Transform = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const particle3Transform = particle3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  return (
    <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
      <LinearGradient
        colors={['#fce4ec', '#f8bbd9', '#f48fb1', '#e91e63']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Particulas animadas */}
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            {
              opacity: particle1,
              transform: [{ translateY: particle1Transform }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            {
              opacity: particle2,
              transform: [{ translateY: particle2Transform }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            {
              opacity: particle3,
              transform: [{ translateY: particle3Transform }],
            },
          ]}
        />

        {/* Logo animado */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, logoPulse) },
                { rotate: logoRotate },
              ],
            },
          ]}
        >
          {/* Efecto de brillo */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
              },
            ]}
          />
          
          <View style={styles.logoWrapper}>
            <View style={styles.logoBackground}>
              <Image
                source={require('../../assets/LogoEternalMovil.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        {/* Texto de la marca */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          <Animated.Text style={styles.brandName}>Eternal Joyería</Animated.Text>
          <Animated.Text style={styles.brandTagline}>Elegancia en cada detalle</Animated.Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Partículas flotantes
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  particle1: {
    top: '25%',
    left: '20%',
  },
  particle2: {
    top: '30%',
    right: '25%',
  },
  particle3: {
    bottom: '35%',
    left: '30%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  // Efecto de brillo
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  logoBackground: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#e9ecef',
    padding: 25,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(173, 20, 87, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  brandTagline: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(173, 20, 87, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SplashScreen; 