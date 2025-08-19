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
    navigation.navigate('Payment', { totalAmount: getTotalPrice() });
  };

  if (cartItems.length === 0) {
    return (
      <LinearGradient
        colors={['#FFE7E7', '#FFFFFF']}
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
    <View style={styles.container}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderTitle}>Mi carrito</Text>
      </View>
      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={`${item._id}-${item.size}`} style={styles.productItem}>
            <Image source={getProductImage(item)} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name || 'Producto sin nombre'}</Text>
              {item.size && (
                <Text style={styles.productSize}>Talla: {item.size}</Text>
              )}
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, item.size, -1)}
                >
                  <Ionicons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, item.size, 1)}
                >
                  <Ionicons name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.productPrice}>${(item.finalPrice || item.price || 0).toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeItem(item._id, item.size)}
            >
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.checkoutSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceder a pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos para el carrito vacío
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFE7E7', // Fondo rosa claro como en la imagen
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
    color: '#000',
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
    marginBottom: 20, // Adjusted for button position
  },
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  shopButton: {
    backgroundColor: '#000',
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 0, // Esquina superior derecha no redondeada
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 0, // Esquina inferior izquierda no redondeada como en la imagen
    marginLeft: 'auto', // Empuja el botón hacia la derecha
    marginRight: 0, // Completamente a la derecha
    marginBottom: 0, // Moved very close to bottom (minimal marginBottom)
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    backgroundColor: '#FFFFFF',
  },
  cartHeader: {
    alignItems: 'center',
    justifyContent: 'center', // Centered without back button
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  cartHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  productList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5, // Adjusted for size text
  },
  productSize: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkoutSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen; 