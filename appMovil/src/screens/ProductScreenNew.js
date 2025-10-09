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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchCategories from '../hooks/useFetchCategories';
import Card from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';

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
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      
      <View style={styles.background}>
        {/* Encabezado */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Logo y subtexto arriba */}
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>Eternal Joyería</Text>
            <Text style={styles.logoSubtext}>Luce la elegancia de la naturaleza</Text>
          </View>
          
          {/* Saludo y foto de perfil abajo */}
          <View style={styles.welcomeSection}>
            <Image
              source={(user?.profilePicture || user?.profileImage)
                ? { uri: user.profilePicture || user.profileImage }
                : require('../../assets/Usuarionuevo.jpg')}
              style={styles.profileImage}
            />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>
                Bienvenido/a
              </Text>
              <Text style={styles.userName}>
                {user?.firstName || user?.name || 'Usuario'} {user?.lastName || ''}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Sección de categorías */}
        <Animated.View style={[styles.categoriesSection, { opacity: fadeAnim }]}>
          <Text style={styles.categoriesTitle}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {(() => {
              // Crear array de categorías sin duplicar 'todos'
              const allCategories = [{ _id: 'todos', name: 'Todo tipo de accesorios' }];
              
              // Agregar categorías del backend que no sean 'todos'
              if (categories && categories.length > 0) {
                categories.forEach(cat => {
                  const catId = cat._id || cat.id;
                  if (catId !== 'todos') {
                    allCategories.push(cat);
                  }
                });
              }
              
              return allCategories.map((cat, index) => {
                const id = cat._id || cat.id;
                const name = cat.name || 'Categoría';
                const active = (selectedCategory || 'todos') === id;
                return (
                  <TouchableOpacity
                    key={`category-${id}-${index}`} // Key única con índice
                    style={[styles.categoryButton, active && styles.categoryButtonActive]}
                    onPress={() => setSelectedCategory(id)}
                    disabled={loadingCategories}
                  >
                    <Text style={[styles.categoryButtonText, active && styles.categoryButtonTextActive]}>
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              });
            })()}
          </ScrollView>
        </Animated.View>

        {/* Sección de productos */}
        <Animated.View style={[styles.productsSection, { opacity: fadeAnim }]}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {loadingProducts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando productos...</Text>
              </View>
            ) : filteredProducts?.length ? (
              <View style={styles.grid}>
                {filteredProducts.map((prod) => {
                  const imageUrl = Array.isArray(prod.images) && prod.images.length ? prod.images[0] : prod.image;
                  const priceValue = prod.finalPrice != null ? prod.finalPrice : prod.price;
                  const hasDiscount = prod.discountPercentage && prod.discountPercentage > 0;
                  const isOutOfStock = prod.stock === 0;
                  
                  return (
                    <Card
                      key={prod._id || prod.id}
                      style={styles.productCard}
                      padding="none"
                      shadow="medium"
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('ProductDetail', { productId: prod._id || prod.id })}
                      >
                        <View style={styles.cardImageContainer}>
                          <Image
                            source={imageUrl ? { uri: imageUrl } : require('../../assets/icon.png')}
                            style={styles.cardImage}
                          />
                          
                          {/* Indicador de descuento */}
                          {hasDiscount && (
                            <View style={styles.discountBadge}>
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
                        
                        <View style={styles.cardInfo}>
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
                        </View>
                      </TouchableOpacity>
                    </Card>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No hay productos disponibles</Text>
                <Text style={styles.noProductsSubtext}>Explora nuestras otras colecciones</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  logoSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '400',
    textAlign: 'center',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    marginRight: SPACING.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  categoriesSection: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  categoriesTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    paddingRight: SPACING.xl,
  },
  categoryButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryButtonActive: {
    backgroundColor: '#f8bbd9',
    borderColor: '#f8bbd9',
  },
  categoryButtonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  noProductsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  noProductsText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  noProductsSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  productCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    marginBottom: SPACING.lg,
  },
  cardImageContainer: {
    position: 'relative',
    backgroundColor: COLORS.backgroundSecondary,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.backgroundSecondary,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  discountText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  outOfStockText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardInfo: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
    minHeight: 40,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  originalPrice: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  cardPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default ProductScreen;
