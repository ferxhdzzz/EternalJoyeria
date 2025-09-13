import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // Ancho para 2 columnas con margen

const ProductCard = ({ product, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const isOutOfStock = product.stock === 0;
  const stockStatus = product.stock > 10 ? 'high' : product.stock > 0 ? 'low' : 'out';
  
  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start(() => onPress(product));
  };

  const toggleFavorite = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsFavorite(!isFavorite);
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const getStockStatusColor = () => {
    switch(stockStatus) {
      case 'high': return '#10B981'; // Green
      case 'low': return '#F59E0B'; // Amber
      default: return '#EF4444'; // Red
    }
  };

  return (
    <Animated.View 
      style={[
        styles.card, 
        isOutOfStock && styles.outOfStockCard,
        { 
          transform: [{ scale: scaleValue }],
          opacity: fadeAnim,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 6,
        }
      ]}
    >
      <View style={styles.badgeContainer}>
        {hasDiscount && (
          <View style={[styles.badge, styles.discountBadge]}>
            <Text style={styles.badgeText}>-{product.discountPercentage}%</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? '#EC4899' : '#9CA3AF'} 
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={animatePress}
        disabled={isOutOfStock}
        activeOpacity={0.9}
      >
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://via.placeholder.com/500x500/FFF5F7/9B9B9B?text=Sin+Imagen'
            }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Badge de descuento */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
            </View>
          )}
          
          {/* Badge de sin stock */}
          {isOutOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>AGOTADO</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={22} 
                color={isFavorite ? '#E8B4CB' : '#FFFFFF'} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={styles.categoryName}>
            {product.category_id?.name || 'Sin categoría'}
          </Text>

          {/* Precios */}
          <View style={styles.priceContainer}>
            {hasDiscount ? (
              <>
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
                <Text style={styles.finalPrice}>{formatPrice(product.finalPrice)}</Text>
              </>
            ) : (
              <Text style={styles.finalPrice}>{formatPrice(product.price)}</Text>
            )}
          </View>
          
          {/* Valoración */}
          {product.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
          )}
          
          {/* Stock */}
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockDot, 
              { backgroundColor: isOutOfStock ? '#FF6B6B' : product.stock <= 3 ? '#FFA500' : '#4CAF50' }
            ]} />
            <Text style={styles.stockText}>
              {isOutOfStock ? 'Agotado' : product.stock <= 3 ? `¡Solo ${product.stock} disponibles!` : 'Disponible'}
            </Text>
          </View>
          
          {/* Botón de añadir al carrito */}
          {!isOutOfStock && (
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={(e) => {
                e.stopPropagation();
                console.log('Añadir al carrito:', product._id);
              }}
            >
              <Text style={styles.addToCartText}>Añadir al carrito</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Función para formatear el precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(price);
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    width: CARD_WIDTH,
    margin: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: '#EC4899',
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  outOfStockCard: {
    opacity: 0.7,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    backgroundColor: '#FFF9FA',
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: '#E8B4CB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 14,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 2,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  productInfo: {
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D2D2D',
    marginBottom: 4,
    lineHeight: 20,
    minHeight: 40,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontFamily: 'Poppins-Regular',
  },
  finalPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#D4AF37',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
    marginLeft: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  inStockText: {
    color: '#4CAF50',
  },
  lowStockText: {
    color: '#FF9800',
  },
  addToCartButton: {
    backgroundColor: '#E8B4CB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export default ProductCard;
