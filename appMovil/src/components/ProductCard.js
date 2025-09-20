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
import { LinearGradient } from 'expo-linear-gradient';
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
        }
      ]}
    >
      <TouchableOpacity 
        onPress={animatePress}
        disabled={isOutOfStock}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        {/* Imagen del producto con gradiente */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://via.placeholder.com/500x500/FEF7E7/D4AF37?text=Eternal+Joyería'
            }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Gradiente overlay elegante */}
          <LinearGradient
            colors={['transparent', 'rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.2)']}
            style={styles.imageGradient}
          />
          
          {/* Badge de descuento */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
            </View>
          )}
          
          {/* Badge de sin stock */}
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>AGOTADO</Text>
            </View>
          )}
          
          {/* Botón de favorito */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isFavorite ? '#d4af37' : '#8b4513'} 
            />
          </TouchableOpacity>
        </View>

        {/* Información del producto con diseño elegante */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(254, 247, 231, 0.95)']}
          style={styles.productInfo}
        >
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <View style={styles.categoryContainer}>
            <Ionicons name="diamond-outline" size={12} color="#d4af37" />
            <Text style={styles.categoryName}>
              {product.category_id?.name || 'Joyería'}
            </Text>
          </View>

          {/* Precios con estilo elegante */}
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
          
          {/* Valoración con estrellas doradas */}
          {product.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name={star <= product.rating ? "star" : "star-outline"} 
                    size={12} 
                    color="#d4af37" 
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                ({product.rating.toFixed(1)})
              </Text>
            </View>
          )}
          
          {/* Stock con indicador elegante */}
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: isOutOfStock ? '#e74c3c' : product.stock <= 3 ? '#f39c12' : '#27ae60' }
            ]} />
            <Text style={[
              styles.stockText,
              { color: isOutOfStock ? '#e74c3c' : product.stock <= 3 ? '#f39c12' : '#27ae60' }
            ]}>
              {isOutOfStock ? 'Agotado' : product.stock <= 3 ? `Solo ${product.stock} disponibles` : 'Disponible'}
            </Text>
          </View>
        </LinearGradient>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    margin: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    width: CARD_WIDTH - 12,
    shadowColor: '#d4af37',
    shadowOffset: { 
      width: 0, 
      height: 8 
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardTouchable: {
    flex: 1,
  },
  outOfStockCard: {
    opacity: 0.6,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: '#fef7e7',
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
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
    top: 12,
    left: 0,
    backgroundColor: '#d4af37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 3,
    shadowColor: '#b8860b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 3,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    padding: 16,
    paddingTop: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A0758A',
    marginBottom: 6,
    lineHeight: 22,
    minHeight: 44,
    letterSpacing: 0.3,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a0522d',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4af37',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0758A',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default ProductCard;
