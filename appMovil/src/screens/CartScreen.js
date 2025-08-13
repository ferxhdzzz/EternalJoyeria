import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation, route }) => {
  // Estado para simular productos en el carrito (inicialmente vacío)
  const [cartItems, setCartItems] = useState([]);

  // Verificar si se pasaron productos desde otra pantalla
  useEffect(() => {
    console.log('CartScreen useEffect triggered');
    console.log('Route params:', JSON.stringify(route.params));
    
    // Verificar parámetros del route
    if (route.params?.newProduct) {
      const newProduct = route.params.newProduct;
      console.log('New product found in route params:', JSON.stringify(newProduct));
      addProductToCart(newProduct);
      navigation.setParams({ newProduct: undefined });
    }
  }, [route.params?.newProduct]);

  // Función para añadir producto al carrito
  const addProductToCart = (newProduct) => {
    // Verificar si el producto ya existe en el carrito (por id y talla)
    const existingProductIndex = cartItems.findIndex(item => 
      item.id === newProduct.id && item.size === newProduct.size
    );
    
    if (existingProductIndex >= 0) {
      // Si ya existe, aumentar la cantidad
      setCartItems(prevItems => 
        prevItems.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Si no existe, añadirlo
      setCartItems(prevItems => [...prevItems, { ...newProduct, quantity: 1 }]);
    }
  };

  // Función para obtener la imagen del producto
  const getProductImage = (product) => {
    // If the product comes with a direct image source (from ProductDetailScreen)
    if (product.image && typeof product.image === 'object') {
      return product.image;
    }
    
    // If it comes with an image name (from test products)
    if (product.image && typeof product.image === 'string') {
      const imageMap = {
        'peinetarosa': require('../../assets/Productos/peinetarosa.png'),
        'aretedoradomargarita': require('../../assets/Productos/aretedoradomargarita.png'),
        'collarorchidmorado': require('../../assets/Productos/collarorchidmorado.png'),
      };
      return imageMap[product.image] || require('../../assets/Productos/peinetarosa.png');
    }
    
    // Default fallback image
    return require('../../assets/Productos/peinetarosa.png');
  };

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Navegar a la pantalla de pago
    navigation.navigate('Payment', { totalAmount: getTotalPrice() });
  };

  // Función para añadir productos al carrito (para pruebas)
  const addTestProducts = () => {
    setCartItems([
      {
        id: 1,
        name: 'Peineta de orquidea roja',
        price: 25.00,
        quantity: 1,
        image: 'peinetarosa',
        size: '20 mm',
      },
      {
        id: 2,
        name: 'Aretes cafes',
        price: 25.00,
        quantity: 1,
        image: 'aretedoradomargarita',
        size: '15 mm',
      },
      {
        id: 3,
        name: 'Collar de orquidea morada',
        price: 25.00,
        quantity: 1,
        image: 'collarorchidmorado',
        size: '10 mm',
      },
    ]);
  };

  // Si el carrito está vacío, mostrar la pantalla vacía
  if (cartItems.length === 0) {
    return (
      <LinearGradient
        colors={['#FFE7E7', '#FFFFFF']}
        style={styles.emptyContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrito</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Shopping Cart Illustration */}
          <View style={styles.cartContainer}>
            <Image
              source={require('../../assets/carrito.png')}
              style={styles.cartImage}
              resizeMode="contain"
            />
            
            {/* Sparkle Stars */}
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

          {/* Motivational Text */}
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Aún no hay brillo</Text>
            <Text style={styles.subText}>en tu carrito</Text>
          </View>
        </View>

        {/* Shop Button */}
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.shopButtonText}>Comprar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // Si hay productos, mostrar la interfaz completa del carrito
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderTitle}>Mi carrito</Text>
      </View>

      {/* Product List */}
      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={`${item.id}-${item.size}`} style={styles.productItem}>
            {/* Product Image */}
            <Image source={getProductImage(item)} style={styles.productImage} />
            
            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              {item.size && (
                <Text style={styles.productSize}>Talla: {item.size}</Text>
              )}
              
              {/* Quantity Controls */}
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Ionicons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Ionicons name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.productPrice}>${(item.price || 0).toFixed(2)}</Text>
            </View>
            
            {/* Remove Button */}
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 100 }} /> {/* Extra space for scroll */}
      </ScrollView>

      {/* Total and Checkout */}
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