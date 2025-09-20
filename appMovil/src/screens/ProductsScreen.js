import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const { width, height } = Dimensions.get('window');

const ProductsScreen = ({ navigation }) => {
  const { products, loading, error, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const animation = Animated.parallel([
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
    ]);
    
    const timer = setTimeout(() => {
      animation.start(() => setIsAnimationComplete(true));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Recargar productos cuando la pantalla obtiene foco
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Función para refrescar productos
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Navegar al detalle del producto
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      productName: product.name 
    });
  };

  // Renderizar cada producto
  const renderProduct = ({ item }) => (
    <View style={styles.cardContainer}>
      <ProductCard 
        product={item} 
        onPress={handleProductPress}
      />
    </View>
  );

  // Mostrar error si existe
  if (error && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
        <LinearGradient
          colors={['#fef7e7', '#fdf4e3', '#fcf1df']}
          style={styles.background}
        >
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#d4af37" />
            <Text style={styles.errorTitle}>Error al cargar productos</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
      
      <LinearGradient
        colors={['#fef7e7', '#fdf4e3', '#fcf1df']}
        style={styles.background}
      >
        {/* Elementos decorativos */}
        {isAnimationComplete && (
          <>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
          </>
        )}

        {/* Header Elegante */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Eternal Joyería</Text>
            <View style={styles.logoUnderline} />
          </View>
          <Text style={styles.welcomeTitle}>Colección Exclusiva</Text>
          <Text style={styles.welcomeSubtitle}>
            Descubre nuestras joyas más elegantes
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="diamond-outline" size={20} color="#d4af37" />
              <Text style={styles.statText}>
                {products.length} {products.length === 1 ? 'joya' : 'joyas'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={20} color="#d4af37" />
              <Text style={styles.statText}>Premium</Text>
            </View>
          </View>
        </Animated.View>

        {/* Lista de productos */}
        {loading && products.length === 0 ? (
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <ActivityIndicator size="large" color="#d4af37" />
            <Text style={styles.loadingText}>Cargando joyas exclusivas...</Text>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.productsContainer, { opacity: fadeAnim }]}>
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item._id}
              numColumns={2}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#d4af37']}
                  tintColor="#d4af37"
                />
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !loading && (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="diamond-outline" size={60} color="#d4af37" />
                    <Text style={styles.emptyTitle}>No hay joyas disponibles</Text>
                    <Text style={styles.emptyMessage}>
                      Desliza hacia abajo para actualizar nuestra colección
                    </Text>
                  </View>
                )
              }
            />
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7e7',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 40,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#b8860b',
    marginTop: 8,
    borderRadius: 2,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#8b4513',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b4513',
  },
  productsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 30,
  },
  cardContainer: {
    flex: 1,
    maxWidth: '50%',
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8b4513',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8b4513',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#b8860b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b4513',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    lineHeight: 22,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    top: -50,
    right: -50,
    zIndex: 0,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(184, 134, 11, 0.06)',
    bottom: -100,
    left: -100,
    zIndex: 0,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 69, 19, 0.08)',
    top: '40%',
    right: -30,
    zIndex: 0,
  },
});

export default ProductsScreen;
