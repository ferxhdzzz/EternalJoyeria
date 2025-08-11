import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen2 = ({ onNext }) => {
  // Referencias para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.8)).current;

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.imageSection}>
        <LinearGradient
          colors={['#FFE4E1', '#FFF5F5']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
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
        <Text style={styles.mainTitle}>
          Luce la elegancia{'\n'}de la naturaleza
        </Text>
        <Text style={styles.description}>
          Descubre nuestras mejores{'\n'}colecciones a los mejores precios y{'\n'}calidad excepcional.
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.navigationDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
          <View>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
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
    paddingBottom: 140, // Aumentado de 100 a 140 para parte de abajo más alargada
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
    backgroundColor: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingRight: 0,
    paddingLeft: 30, // Padding solo a la izquierda para los puntos
  },
  startButton: {
    backgroundColor: '#000',
    paddingVertical: 40, // Aumentado de 28 a 40 para hacer el botón más largo verticalmente
    paddingHorizontal: 80,
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
    minWidth: 180,
    marginRight: 0,
    marginLeft: 'auto',
    position: 'absolute',
    right: -10, // Cambiado de 0 a -10 para mover el botón un poco más a la derecha
    bottom: -50, // Cambiado de -40 a -50 para mover el botón un poquito más abajo
  },
  startButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    textAlign: 'left', 
    marginTop: -8,
    marginLeft: -20,
  },
});

export default WelcomeScreen2; 