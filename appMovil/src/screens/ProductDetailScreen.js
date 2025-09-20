import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const { productId } = route.params;
  const { addProductToCart } = useCart();
  const { fetchProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showAddToCartSuccess,
  } = useCustomAlert();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Cargar producto por ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const result = await fetchProductById(productId);
        if (result.success) {
          setProduct(result.product);
          // Establecer talla por defecto basada en measurements
          if (result.product.measurements) {
            const measurements = Object.keys(result.product.measurements);
            setSelectedSize(measurements[0] || 'Talla única');
          }
          
          // Iniciar animaciones después de cargar
          setTimeout(() => {
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
              Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
              }),
            ]).start(() => setIsAnimationComplete(true));
          }, 100);
          // Logs de diagnóstico para detectar tipos inesperados
          try {
            const p = result.product || {};
            console.log('[ProductDetail DBG] Types:', {
              name: typeof p.name,
              price: typeof p.price,
              finalPrice: typeof p.finalPrice,
              discountPercentage: typeof p.discountPercentage,
              stock: typeof p.stock,
              category_id: typeof p.category_id,
              category_name: p.category_id && typeof p.category_id === 'object' ? typeof p.category_id.name : undefined,
              images_isArray: Array.isArray(p.images),
              image0_type: Array.isArray(p.images) && p.images.length ? typeof p.images[0] : undefined,
              description: typeof p.description,
            });
          } catch (e) {
            console.log('[ProductDetail DBG] logging error', e);
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
        <LinearGradient
          colors={['#fef7e7', '#fdf4e3', '#fcf1df']}
          style={styles.background}
        >
          <View style={styles.loadingContainer}>
            <Ionicons name="diamond-outline" size={60} color="#d4af37" />
            <ActivityIndicator size="large" color="#d4af37" style={{ marginTop: 20 }} />
            <Text style={styles.loadingText}>Cargando joya exclusiva...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
        <LinearGradient
          colors={['#fef7e7', '#fdf4e3', '#fcf1df']}
          style={styles.background}
        >
          <View style={styles.errorContainer}>
            <Ionicons name="sad-outline" size={60} color="#d4af37" />
            <Text style={styles.errorText}>{error || 'Joya no encontrada'}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Normalizaciones seguras
  const nameStr = String(product?.name ?? '');
  const discountPct = Number(product?.discountPercentage ?? 0);
  const priceNum = Number(product?.price ?? 0);
  const finalPriceNum = Number(product?.finalPrice ?? product?.price ?? 0);
  const stockNum = Number(product?.stock ?? 0);
  const categoryName = product?.category_id && typeof product.category_id === 'object'
    ? String(product.category_id.name ?? 'Sin categoría')
    : (typeof product?.category_id === 'string' ? String(product.category_id) : 'Sin categoría');
  const imageFirst = (Array.isArray(product?.images) && product.images.length)
    ? product.images[0]
    : product?.image;
  const imageUri = (typeof imageFirst === 'string' && imageFirst.length > 0)
    ? imageFirst
    : 'https://via.placeholder.com/400x400?text=Sin+Imagen';

  const hasDiscount = discountPct > 0;
  const isOutOfStock = stockNum === 0;
  const measurements = product.measurements ? Object.keys(product.measurements) : [];

  const handleAddToCart = () => {
    if (isOutOfStock) {
      Alert.alert('Producto agotado', 'Este producto no está disponible actualmente.');
      return;
    }

    const productToAdd = {
      ...product,
      selectedSize: selectedSize,
      quantity: 1,
    };
    
    addProductToCart(productToAdd);
    
    // Usar alerta personalizada
    showAddToCartSuccess(
      product.name || 'Producto',
      () => navigation.navigate('MainTabs', { screen: 'Carrito' }), // Ver carrito
      () => {} // Seguir comprando (no hacer nada)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
        style={styles.background}
      >
        {/* Header elegante sin título */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4a148c" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
          </View>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Reviews', { product })}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#4a148c" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Imagen del producto con diseño lujoso */}
          <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(142, 36, 170, 0.1)']}
                style={styles.imageOverlay}
              />
            </View>
            
            {/* Badge de descuento elegante */}
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Ionicons name="pricetag" size={12} color="#fff" />
                <Text style={styles.discountBadgeText}>-{String(discountPct)}%</Text>
              </View>
            )}
            
            {/* Badge de stock elegante */}
            {isOutOfStock && (
              <View style={styles.outOfStockBadge}>
                <Ionicons name="close-circle" size={12} color="#fff" />
                <Text style={styles.outOfStockBadgeText}>Agotado</Text>
              </View>
            )}
          </Animated.View>

          {/* Información del producto con diseño lujoso */}
          <Animated.View style={[styles.productInfo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 228, 236, 0.8)']}
              style={styles.infoGradient}
            >
            {/* Nombre y categoría elegantes */}
            <View style={styles.titleSection}>
              <Text style={styles.productName}>{nameStr}</Text>
              <View style={styles.categoryContainer}>
                <Ionicons name="diamond" size={14} color="#ab47bc" />
                <Text style={styles.categoryName}>{categoryName}</Text>
              </View>
            </View>

            {/* Precios con diseño lujoso */}
            <View style={styles.priceSection}>
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                style={styles.priceContainer}
              >
                {hasDiscount ? (
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>${priceNum.toLocaleString()}</Text>
                    <Text style={styles.finalPrice}>${finalPriceNum.toLocaleString()}</Text>
                  </View>
                ) : (
                  <Text style={styles.finalPrice}>${priceNum.toLocaleString()}</Text>
                )}
              </LinearGradient>
            </View>

            {/* Stock con indicador elegante */}
            <View style={styles.stockSection}>
              <View style={styles.stockContainer}>
                <View style={[
                  styles.stockIndicator,
                  { backgroundColor: isOutOfStock ? '#e74c3c' : stockNum <= 3 ? '#f39c12' : '#27ae60' }
                ]} />
                <Text style={[
                  styles.stockText,
                  isOutOfStock ? styles.outOfStockText : 
                  stockNum <= 3 ? styles.lowStockText : styles.inStockText
                ]}>
                  {isOutOfStock ? 'Sin stock disponible' : 
                   stockNum <= 3 ? `Solo ${stockNum} disponibles` : 
                   `${stockNum} disponibles`}
                </Text>
              </View>
            </View>

            {/* Medidas/Tallas elegantes */}
            {measurements.length > 0 && (
              <View style={styles.measurementsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="resize" size={18} color="#8e24aa" />
                  <Text style={styles.sectionTitle}>Medidas disponibles</Text>
                </View>
                <View style={styles.measurementOptions}>
                  {measurements.map((measurement) => (
                    <TouchableOpacity
                      key={String(measurement)}
                      style={[
                        styles.measurementOption,
                        selectedSize === measurement && styles.measurementOptionSelected
                      ]}
                      onPress={() => setSelectedSize(measurement)}
                    >
                      <Text style={[
                        styles.measurementText,
                        selectedSize === measurement && styles.measurementTextSelected
                      ]}>
                        {String(measurement)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Descripción elegante */}
            <View style={styles.descriptionSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={18} color="#8e24aa" />
                <Text style={styles.sectionTitle}>Descripción</Text>
              </View>
              <Text style={styles.descriptionText}>{String(product?.description ?? '')}</Text>
            </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>

        {/* Botón de añadir al carrito elegante */}
        <View style={styles.bottomSection}>
          <LinearGradient
            colors={isOutOfStock ? ['#bdbdbd', '#9e9e9e'] : ['#e91e63', '#ad1457']}
            style={[
              styles.addToCartButton,
              isOutOfStock && styles.addToCartButtonDisabled
            ]}
          >
            <TouchableOpacity 
              style={styles.addToCartTouchable}
              onPress={handleAddToCart}
              disabled={isOutOfStock}
            >
              <Ionicons 
                name={isOutOfStock ? "close-circle" : "bag-add"} 
                size={20} 
                color="#fff" 
                style={styles.cartIcon}
              />
              <Text style={styles.addToCartText}>
                {isOutOfStock ? 'Producto agotado' : 'Añadir al carrito'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
      
      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        autoClose={alertConfig.autoClose}
        autoCloseDelay={alertConfig.autoCloseDelay}
        showIcon={alertConfig.showIcon}
        animationType={alertConfig.animationType}
      />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: 'transparent',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  productImage: {
    width: width - 40,
    height: 320,
    borderRadius: 20,
  },
  discountBadge: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  outOfStockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    margin: 16,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  infoGradient: {
    padding: 25,
    borderRadius: 25,
  },
  titleSection: {
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a148c',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  categoryName: {
    fontSize: 16,
    color: '#8e24aa',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priceSection: {
    marginBottom: 20,
  },
  priceContainer: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  stockSection: {
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 12,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inStockText: {
    color: '#4CAF50',
  },
  lowStockText: {
    color: '#FF9800',
  },
  outOfStockText: {
    color: '#F44336',
  },
  measurementsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  measurementOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  measurementOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ab47bc',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  measurementOptionSelected: {
    backgroundColor: '#e91e63',
    borderColor: '#ad1457',
  },
  measurementText: {
    fontSize: 14,
    color: '#4a148c',
    fontWeight: '600',
  },
  measurementTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4a148c',
    lineHeight: 24,
    textAlign: 'justify',
  },
  bottomSection: {
    padding: 20,
  },
  addToCartButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  cartIcon: {
    marginRight: 5,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProductDetailScreen; 