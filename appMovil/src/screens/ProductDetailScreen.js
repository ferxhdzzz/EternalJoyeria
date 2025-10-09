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
  Animated,
  Platform,
} from 'react-native';
import { StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showAddToCartSuccess,
    showStockError,
  } = useCustomAlert();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Funciones para navegación de imágenes
  const getProductImages = () => {
    if (!product) return ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
    
    let images = [];
    
    // Priorizar array de imágenes
    if (Array.isArray(product.images) && product.images.length > 0) {
      images = product.images.filter(img => 
        img && typeof img === 'string' && img.trim().length > 0
      );
    }
    
    // Si no hay imágenes en el array, usar imagen individual
    if (images.length === 0 && product.image && typeof product.image === 'string') {
      images = [product.image];
    }
    
    // Si no hay imágenes válidas, usar placeholder
    if (images.length === 0) {
      images = ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
    }
    
    console.log('Imágenes del producto:', images);
    return images;
  };

  const navigateImage = (direction) => {
    const images = getProductImages();
    if (images.length <= 1) return;
    
    // Resetear estado de carga al cambiar imagen
    setImageLoading(true);
    
    setCurrentImageIndex(prevIndex => {
      if (direction === 'next') {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      }
    });
  };

  // Cargar producto por ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const result = await fetchProductById(productId);
        if (result.success) {
          // Logs de depuracion para verificar tallas/medidas desde backend
          try {
            console.log('[ProductDetail] Producto recibido:', result.product);
            const mRaw = result.product?.measurements;
            console.log('[ProductDetail] measurements (raw):', mRaw, 'tipo:', typeof mRaw, 'esArray?', Array.isArray(mRaw));
            const sizesDerived = mRaw ? (Array.isArray(mRaw) ? mRaw : Object.keys(mRaw)) : [];
            console.log('[ProductDetail] tallas derivadas:', sizesDerived);
          } catch (e) {
            console.log('[ProductDetail] Error log measurements:', e);
          }
          setProduct(result.product);
          // Resetear índice de imagen al cargar nuevo producto
          setCurrentImageIndex(0);
          // Establecer talla por defecto basada en measurements (orden preferido)
          if (result.product.measurements) {
            const preferredOrder = ['weight', 'height', 'width'];
            const keys = Object.keys(result.product.measurements);
            const ordered = keys.sort((a, b) => {
              const ia = preferredOrder.indexOf(a);
              const ib = preferredOrder.indexOf(b);
              const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
              const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
              if (sa === sb) return a.localeCompare(b);
              return sa - sb;
            });
            setSelectedSize(ordered[0] || 'Talla única');
          } else {
            setSelectedSize('Talla única');
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
        <StatusBar style="dark" />
        <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#999" />
          <Text style={[styles.loadingText, { marginTop: 12 }]}>Cargando producto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={[styles.background, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Ionicons name="alert-circle-outline" size={56} color="#d32f2f" />
          <Text style={[styles.errorText, { marginTop: 12 }]}>{error || 'Producto no encontrado'}</Text>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: '#333', marginTop: 10 }]} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
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
  // Imagen del producto - usar índice actual para carrusel
  const productImages = getProductImages();
  const currentImage = productImages[currentImageIndex] || productImages[0];
  const imageUri = (typeof currentImage === 'string' && currentImage.length > 0)
    ? currentImage
    : 'https://via.placeholder.com/400x400?text=Sin+Imagen';

  const hasDiscount = discountPct > 0;
  const isOutOfStock = stockNum === 0;
  const measurements = product.measurements ? Object.keys(product.measurements) : [];
  const sizeDisplayName = (k) => {
    const map = { weight: 'Peso', height: 'Altura', width: 'Ancho' };
    return map[k] || String(k);
  };
  const formatMeasurement = (key, val) => {
    if (val == null) return '-';
    const raw = String(val).trim();
    // Si ya viene con unidad, no modificar
    if (/[a-zA-Z]/.test(raw)) return raw;
    const num = Number(raw);
    if (Number.isNaN(num)) return raw;
    if (key === 'weight') {
      // Heurística: <1000 -> gramos, si no -> kg
      if (num < 1000) return `${num} g`;
      const kg = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 2);
      return `${kg} kg`;
    }
    if (key === 'height' || key === 'width') {
      // Altura/Ancho en cm por defecto
      return `${num} cm`;
    }
    // Por defecto, mostrar valor tal cual
    return raw;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      Alert.alert('Producto agotado', 'Este producto no está disponible actualmente.');
      return;
    }

    const productToAdd = {
      ...product,
      selectedSize: selectedSize || 'Talla única',
      size: selectedSize || 'Talla única',
      quantity: 1,
      stock: stockNum, // Pasar el stock actual
    };
    
    const success = addProductToCart(productToAdd);
    
    if (success) {
      // Usar alerta personalizada
      showAddToCartSuccess(
        product.name || 'Producto',
        () => navigation.navigate('MainTabs', { screen: 'Carrito' }), // Ver carrito
        () => {} // Seguir comprando (no hacer nada)
      );
    } else {
      showStockError(
        product.name || 'Producto',
        stockNum,
        () => navigation.navigate('MainTabs', { screen: 'Carrito' }), // Ver carrito
        () => navigation.goBack() // Seguir comprando (volver)
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header con título y reseñas */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2d2d2d" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Detalle del Producto</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Reviews', { product })}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2d2d2d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        {/* Carrusel de Imágenes */}
        <View style={[styles.imageContainer, { padding: 16, marginTop: 16 }]}>
          <View style={styles.imageWrapper}>
            {/* Indicador de carga */}
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color="#999" />
              </View>
            )}
            
            <Image
              key={`product-image-${currentImageIndex}`}
              source={{ uri: imageUri }}
              style={styles.productImage}
              resizeMode="cover"
              onLoadStart={() => {
                setImageLoading(true);
                console.log('Iniciando carga de imagen:', imageUri);
              }}
              onLoad={() => {
                setImageLoading(false);
                console.log('Imagen cargada exitosamente:', imageUri);
              }}
              onError={(error) => {
                setImageLoading(false);
                console.log('Error cargando imagen:', error.nativeEvent.error);
                console.log('URI problemática:', imageUri);
              }}
            />
            
            {/* Flechas de navegación - Solo mostrar si hay más de una imagen */}
            {productImages.length > 1 && (
              <>
                {/* Flecha izquierda */}
                <TouchableOpacity 
                  style={[styles.arrowButton, styles.leftArrow]}
                  onPress={() => navigateImage('prev')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                
                {/* Flecha derecha */}
                <TouchableOpacity 
                  style={[styles.arrowButton, styles.rightArrow]}
                  onPress={() => navigateImage('next')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
                
                {/* Indicadores de imagen */}
                <View style={styles.imageIndicators}>
                  {productImages.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === currentImageIndex && styles.activeIndicator
                      ]}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Título y precio */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={[styles.productName, { marginBottom: 6 }]}>{nameStr}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {hasDiscount && <Text style={[styles.originalPrice, { marginBottom: 0 }]}>${priceNum.toLocaleString()}</Text>}
            <Text style={[styles.finalPrice]}>${finalPriceNum.toLocaleString()}</Text>
          </View>
        </View>

        {/* Stock */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={styles.stockText}>
            {isOutOfStock ? 'Agotado' : stockNum <= 5 ? `Solo quedan ${stockNum}` : 'En stock'}
          </Text>
        </View>

        {/* Medidas */}
        {product?.measurements && (
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Medidas</Text>
            <View style={styles.measuresList}>
              {Object.entries(product.measurements).map(([key, value]) => (
                <View key={String(key)} style={styles.measureRow}>
                  <Text style={styles.measureLabel}>{sizeDisplayName(key)}:</Text>
                  <Text style={styles.measureValue}>{formatMeasurement(key, value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Descripción */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{String(product?.description ?? '')}</Text>
        </View>
      </ScrollView>

      {/* Botón agregar */}
      <View style={[styles.bottomSection, { backgroundColor: '#fff' }]}>
        <TouchableOpacity
          style={[styles.addToCartButton, isOutOfStock && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Text style={styles.addToCartText}>
            {isOutOfStock ? 'Producto agotado' : 'Agregar ahora'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Componente de alerta */}
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
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? ((RNStatusBar.currentHeight || 0) + 36) : 56,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
    width: width - 72, // Ancho específico para que no se expanda
    height: 280, // Altura específica
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 5,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
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
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  categoryName: {
    fontSize: 16,
    color: '#8e24aa',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priceSection: {
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  stockSection: {
    marginBottom: 16,
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
    color: '#111827',
  },
  measurementOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  measurementOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f8bbd9',
    backgroundColor: '#ffffff',
  },
  measurementOptionSelected: {
    backgroundColor: '#f48fb1',
    borderColor: '#f48fb1',
  },
  measurementText: {
    fontSize: 14,
    color: '#2d2d2d',
    fontWeight: '600',
  },
  measurementTextSelected: {
    color: '#000000',
    fontWeight: '700',
  },
  descriptionSection: {
    marginTop: 8,
  },
  measuresList: {
    gap: 8,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  measureLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  measureValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'left',
  },
  bottomSection: {
    padding: 20,
  },
  addToCartButton: {
    backgroundColor: '#000000',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  
  // Estilos para carrusel de imágenes
  arrowButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ translateY: -20 }],
  },
  leftArrow: {
    left: 16,
  },
  rightArrow: {
    right: 16,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
});

export default ProductDetailScreen; 