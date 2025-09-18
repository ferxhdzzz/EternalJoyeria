import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const { productId } = route.params;
  const { addProductToCart } = useCart();
  const { fetchProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

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
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Cargando producto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    
    Alert.alert(
      '¡Producto añadido!',
      'El producto se ha añadido correctamente al carrito',
      [
        {
          text: 'Seguir comprando',
          style: 'cancel'
        },
        {
          text: 'Ver carrito',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Carrito' })
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{nameStr}</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Reviews', { product })}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Badge de descuento */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{String(discountPct)}%</Text>
            </View>
          )}
          
          {/* Badge de stock */}
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockBadgeText}>Agotado</Text>
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          {/* Nombre y categoría */}
          <Text style={styles.productName}>{nameStr}</Text>
          <Text style={styles.categoryName}>
            {`Categoría: ${categoryName}`}
          </Text>

          {/* Precios */}
          <View style={styles.priceSection}>
            {hasDiscount ? (
              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>${priceNum.toLocaleString()}</Text>
                <Text style={styles.finalPrice}>${finalPriceNum.toLocaleString()}</Text>
              </View>
            ) : (
              <Text style={styles.finalPrice}>${priceNum.toLocaleString()}</Text>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockSection}>
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

          {/* Medidas/Tallas */}
          {measurements.length > 0 && (
            <View style={styles.measurementsSection}>
              <Text style={styles.sectionTitle}>Medidas disponibles</Text>
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

          {/* Descripción */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{String(product?.description ?? '')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón de añadir al carrito */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            isOutOfStock && styles.addToCartButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Text style={styles.addToCartText}>
            {isOutOfStock ? 'Producto agotado' : 'Añadir al carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  productImage: {
    width: width - 40,
    height: 300,
    borderRadius: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    backgroundColor: '#666',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outOfStockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  stockSection: {
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  measurementOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  measurementOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  measurementOptionSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  measurementText: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    lineHeight: 24,
  },
  bottomSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  addToCartButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen; 