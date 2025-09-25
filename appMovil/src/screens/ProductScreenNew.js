import React, { useMemo, useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchCategories from '../hooks/useFetchCategories';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Obtener datos del usuario logueado desde AuthContext
  const { user } = useContext(AuthContext);

  // Hooks de datos
  const {
    productos,
    loading: loadingProducts,
    refreshProductos,
  } = useFetchProducts();

  const {
    categories,
    loading: loadingCategories,
    refreshCategories,
  } = useFetchCategories();

  // Animación de entrada
  useEffect(() => {
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

  // Función para refrescar
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshProductos(), refreshCategories()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Cuando cambia la categoría, pedir datos al backend (usa endpoint por categoría)
  useEffect(() => {
    if (selectedCategory === 'todos') {
      refreshProductos(null);
    } else {
      refreshProductos(selectedCategory);
    }
  }, [selectedCategory]);

  // Filtrar productos por categoría seleccionada (defensa extra si llega todo el listado)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productos)) return [];
    if (selectedCategory === 'todos') return productos;
    // Backend: campo de categoría es category_id. Convertimos a string por si viene como ObjectId
    const sel = String(selectedCategory);
    return productos.filter((p) => {
      const cat = p.category_id ?? p.categoryId ?? p.category;
      const catId = (cat && typeof cat === 'object') ? (cat._id ?? cat.id ?? null) : cat;
      return catId != null && String(catId) === sel;
    });
  }, [productos, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
      
      <LinearGradient
        colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
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

        {/* Encabezado */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Eternal Joyería</Text>
            <View style={styles.logoUnderline} />
          </View>
          
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={(user?.profilePicture || user?.profileImage)
                  ? { uri: user.profilePicture || user.profileImage }
                  : require('../../assets/Usuarionuevo.jpg')}
                style={styles.profileImage}
              />
              <View style={styles.profileBorder} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeLabel}>Bienvenido/a</Text>
              <Text style={styles.userName}>{user?.name || user?.firstName || user?.email?.split('@')[0] || 'Usuario'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Seccion de categorias */}
        <Animated.View style={[styles.categoriesSection, { opacity: fadeAnim }]}>
          <View style={styles.categoriesHeader}>
            <Ionicons name="diamond-outline" size={20} color="#4a148c" />
            <Text style={styles.categoriesTitle}>Categorías</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {(categories?.length ? categories : [{ _id: 'todos', name: 'Todas' }]).map((cat) => {
              const id = cat._id || cat.id;
              const name = cat.name || 'Categoría';
              const active = (selectedCategory || 'todos') === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.categoryButton, active && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(id)}
                  disabled={loadingCategories}
                >
                  <Ionicons 
                    name="diamond-outline" 
                    size={16} 
                    color={active ? '#fff' : '#4a148c'} 
                    style={styles.categoryIcon}
                  />
                  <Text style={[styles.categoryButtonText, active && styles.categoryButtonTextActive]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Seccion de productos */}
        <Animated.View style={[styles.productsSection, { opacity: fadeAnim }]}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FFE7E7']}
                tintColor="#FFE7E7"
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {loadingProducts ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="diamond-outline" size={60} color="#FFE7E7" />
                <Text style={styles.loadingText}>Cargando joyas exclusivas...</Text>
              </View>
            ) : filteredProducts?.length ? (
              <View style={styles.grid}>
                {filteredProducts.map((prod) => {
                  const imageUrl = Array.isArray(prod.images) && prod.images.length ? prod.images[0] : prod.image;
                  const priceValue = prod.finalPrice != null ? prod.finalPrice : prod.price;
                  const hasDiscount = prod.discountPercentage && prod.discountPercentage > 0;
                  const isOutOfStock = prod.stock === 0;
                  
                  return (
                    <TouchableOpacity
                      key={prod._id || prod.id}
                      style={styles.card}
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('ProductDetail', { productId: prod._id || prod.id })}
                    >
                      <View style={styles.cardImageContainer}>
                        <Image
                          source={imageUrl ? { uri: imageUrl } : require('../../assets/icon.png')}
                          style={styles.cardImage}
                        />
                        
                        {/* Gradiente de imagen */}
                        <LinearGradient
                          colors={['transparent', 'rgba(232, 180, 203, 0.1)', 'rgba(232, 180, 203, 0.2)']}
                          style={styles.imageGradient}
                        />
                        
                        {/* Indicador de descuento */}
                        {hasDiscount && (
                          <View style={styles.discountBadge}>
                            <Ionicons name="pricetag" size={10} color="#fff" />
                            <Text style={styles.discountText}>-{prod.discountPercentage}%</Text>
                          </View>
                        )}
                        
                        {/* Indicador de stock */}
                        {isOutOfStock && (
                          <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockText}>AGOTADO</Text>
                          </View>
                        )}
                      </View>
                      
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(254, 247, 231, 0.95)']}
                        style={styles.cardInfo}
                      >
                        <Text numberOfLines={2} style={styles.cardTitle}>{prod.name || prod.title}</Text>
                        
                        <View style={styles.cardPriceContainer}>
                          {hasDiscount ? (
                            <>
                              <Text style={styles.originalPrice}>${Number(prod.price || 0).toFixed(2)}</Text>
                              <Text style={styles.cardPrice}>${Number(priceValue || 0).toFixed(2)}</Text>
                            </>
                          ) : (
                            <Text style={styles.cardPrice}>${Number(priceValue || 0).toFixed(2)}</Text>
                          )}
                        </View>
                        
                        {/* Estado de stock */}
                        <View style={styles.stockIndicatorContainer}>
                          <View style={[
                            styles.stockIndicator,
                            { backgroundColor: isOutOfStock ? '#e74c3c' : prod.stock <= 3 ? '#f39c12' : '#27ae60' }
                          ]} />
                          <Text style={[
                            styles.stockText,
                            { color: isOutOfStock ? '#e74c3c' : prod.stock <= 3 ? '#f39c12' : '#27ae60' }
                          ]}>
                            {isOutOfStock ? 'Agotado' : prod.stock <= 3 ? `Solo ${prod.stock}` : 'Disponible'}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noProductsContainer}>
                <Ionicons name="diamond-outline" size={60} color="#FFE7E7" />
                <Text style={styles.noProductsText}>No hay joyas disponibles</Text>
                <Text style={styles.debugText}>Explora nuestras otras colecciones</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    color: '#8e24aa',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(142, 36, 170, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#ab47bc',
    marginTop: 8,
    borderRadius: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#FFE7E7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFE7E7',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#B8869B',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9999',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9999',
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 180, 203, 0.3)',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#e91e63',
    borderColor: '#ad1457',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#FF9999',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#FF9999',
    marginTop: 20,
    fontWeight: '500',
  },
  noProductsContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingVertical: 40,
  },
  noProductsText: {
    fontSize: 20,
    color: '#FF9999',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  debugText: {
    fontSize: 14,
    color: '#B8869B',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: (width - 40 - 12) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232, 180, 203, 0.2)',
    shadowColor: '#FFE7E7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImageContainer: {
    position: 'relative',
    backgroundColor: '#fef7e7',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#fef7e7',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#E8B4CB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 3,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF9999',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 36,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E8B4CB',
    textShadowColor: 'rgba(232, 180, 203, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  stockIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 180, 203, 0.08)',
    top: -50,
    right: -50,
    zIndex: 0,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212, 165, 194, 0.06)',
    bottom: -100,
    left: -100,
    zIndex: 0,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(160, 117, 138, 0.08)',
    top: '40%',
    right: -30,
    zIndex: 0,
  },
});

export default ProductScreen;
