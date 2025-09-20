import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCart();

  const getProductImage = (product) => {
    // ✅ Se corrigió esta función para usar el array de imágenes del producto
    if (product.images && product.images.length > 0) {
      return { uri: product.images[0] };
    }
    // Fallback image (if no image is provided)
    return require('../../assets/Productos/peinetarosa.png');
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <LinearGradient
        colors={['#fdf2f8', '#fce7f3', '#fbcfe8']} // Degradado rosa elegante
        style={styles.emptyContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrito</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.cartContainer}>
            <Image
              source={require('../../assets/carrito.png')}
              style={styles.cartImage}
              resizeMode="contain"
            />
            <View style={styles.sparklesContainer}>
              <View style={[styles.sparkle, styles.sparkle1]}>
                <Ionicons name="star" size={16} color="#FFD700" />
              </View>
              <View style={[styles.sparkle, styles.sparkle2]}>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
              <View style={[styles.sparkle, styles.sparkle3]}>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
              <View style={[styles.sparkle, styles.sparkle4]}>
                <Ionicons name="star" size={10} color="#FFD700" />
              </View>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Aún no hay brillo</Text>
            <Text style={styles.subText}>en tu carrito</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.shopButtonText}>Comprar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f3e5f5', '#e1bee7', '#ce93d8']}
      style={styles.container}
    >
      <View style={styles.cartHeader}>
        <View style={styles.headerContent}>
          <Ionicons name="bag" size={28} color="#4a148c" />
          <Text style={styles.cartHeaderTitle}>Mi carrito</Text>
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{cartItems.length}</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={`${item._id}-${item.size}`} style={styles.productItem}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 230, 255, 0.8)']}
              style={styles.productGradient}
            >
              <View style={styles.imageContainer}>
                <Image source={getProductImage(item)} style={styles.productImage} />
                <View style={styles.imageOverlay} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name || 'Producto sin nombre'}</Text>
                {item.size && (
                  <View style={styles.sizeContainer}>
                    <Ionicons name="resize" size={14} color="#8e24aa" />
                    <Text style={styles.productSize}>Talla: {item.size}</Text>
                  </View>
                )}
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item._id, item.size, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#4a148c" />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item._id, item.size, 1)}
                  >
                    <Ionicons name="add" size={18} color="#4a148c" />
                  </TouchableOpacity>
                </View>
                <View style={styles.priceContainer}>
                  <Ionicons name="diamond" size={16} color="#e91e63" />
                  <Text style={styles.productPrice}>${(item.finalPrice || item.price || 0).toFixed(2)}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeItem(item._id, item.size)}
              >
                <Ionicons name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.checkoutSection}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(225, 190, 231, 0.8)']}
          style={styles.checkoutGradient}
        >
          <View style={styles.totalRow}>
            <View style={styles.totalLabelContainer}>
              <Ionicons name="calculator" size={20} color="#4a148c" />
              <Text style={styles.totalLabel}>Total:</Text>
            </View>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
            </View>
          </View>
          <LinearGradient
            colors={['#e91e63', '#ad1457']}
            style={styles.checkoutButton}
          >
            <TouchableOpacity 
              style={styles.checkoutTouchable}
              onPress={handleCheckout}
            >
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.checkoutButtonText}>Proceder a pago</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Estilos para el carrito vacío
  emptyContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748', // Gris oscuro elegante
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  cartImage: {
    width: width * 0.7,
    height: height * 0.35,
  },
  sparklesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: '8%',
    left: '12%',
  },
  sparkle2: {
    top: '12%',
    left: '22%',
  },
  sparkle3: {
    top: '6%',
    left: '18%',
  },
  sparkle4: {
    top: '10%',
    left: '16%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3748', // Gris oscuro elegante
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4a5568', // Gris medio elegante
  },
  shopButton: {
    backgroundColor: '#ec4899', 
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: 'auto',
    marginRight: 0,
    marginBottom: 0,
    alignItems: 'center',
    shadowColor: '#ec4899', 
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  // Estilos para el carrito con productos
  container: {
    flex: 1,
    backgroundColor: '#f3e5f5',
  },
  cartHeader: {
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  itemCount: {
    backgroundColor: '#e91e63',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  productList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productItem: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  productGradient: {
    flexDirection: 'row',
    padding: 18,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  imageOverlay: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 89,
    height: 89,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ab47bc',
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  productSize: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e24aa',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(106, 27, 154, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    marginHorizontal: 15,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  checkoutGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalAmountContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  checkoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CartScreen; 