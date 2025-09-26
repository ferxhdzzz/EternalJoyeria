import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import { translateSize } from '../utils/sizeTranslations';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCart();
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showStockError,
  } = useCustomAlert();

  // Funciones para formatear medidas (copiadas de ProductDetailScreen)
  const sizeDisplayName = (key) => {
    const names = {
      height: 'Alto',
      width: 'Ancho',
      length: 'Largo',
      diameter: 'Diámetro',
      thickness: 'Grosor',
      weight: 'Peso',
    };
    return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Función para filtrar qué campos mostrar como medidas (no como talla)
  const isValidMeasurement = (key) => {
    const validMeasurements = ['height', 'width', 'length', 'diameter', 'thickness', 'weight'];
    return validMeasurements.includes(key.toLowerCase());
  };

  const formatMeasurement = (key, raw) => {
    if (!raw) return '';
    const str = String(raw).trim();
    if (!str) return '';
    const num = parseFloat(str);
    if (isNaN(num)) return str;
    
    if (key === 'weight') {
      return `${num} g`;
    }
    if (key === 'height' || key === 'width') {
      return `${num} cm`;
    }
    return raw;
  };
  
  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    const maxStock = item.stock || 999;
    
    if (change > 0 && newQuantity > maxStock) {
      showStockError(
        item.name || 'Producto',
        maxStock,
        () => navigation.navigate('MainTabs', { screen: 'Carrito' }), // Ver carrito (ya está aquí)
        () => navigation.navigate('MainTabs', { screen: 'Home' }) // Seguir comprando
      );
      return;
    }
    
    updateQuantity(item._id, item.size, change);
  };

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
      <View style={styles.emptyContainer}>
        <StatusBar style="dark" />
        <View style={styles.headerSimple}>
          <Text style={styles.headerTitle}>Carrito</Text>
        </View>
        <View style={styles.content}> 
          <Image
            source={require('../../assets/carrito.png')}
            style={styles.cartImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Aún no hay brillo</Text>
            <Text style={styles.subText}>en tu carrito</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.cartHeader}>
        <View style={styles.headerContent}>
          <Ionicons name="bag" size={24} color="#2d2d2d" />
          <Text style={styles.cartHeaderTitle}>Mi carrito</Text>
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{cartItems.length}</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={`${item._id}-${item.size}`} style={styles.productItem}>
            <View style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={getProductImage(item)} style={styles.productImage} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name || 'Producto sin nombre'}</Text>
                
                {/* Talla - Solo mostrar si es una talla real, no medidas */}
                {item.size && !isValidMeasurement(item.size) && (
                  <View style={styles.sizeContainer}>
                    <Ionicons name="resize" size={14} color="#6b7280" />
                    <Text style={styles.productSize}>Talla: {translateSize(item.size)}</Text>
                  </View>
                )}

                {/* Medidas - Filtrar solo medidas válidas */}
                {item.measurements && Object.keys(item.measurements).length > 0 && (
                  <View style={styles.measurementsContainer}>
                    <Text style={styles.measurementsTitle}>Medidas:</Text>
                    <View style={styles.measuresList}>
                      {Object.entries(item.measurements)
                        .filter(([key]) => isValidMeasurement(key))
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <View key={String(key)} style={styles.measureRow}>
                            <Text style={styles.measureLabel}>{sizeDisplayName(key)}:</Text>
                            <Text style={styles.measureValue}>{formatMeasurement(key, value)}</Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#111827" />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    {item.stock && (
                      <Text style={styles.stockInfo}>/{item.stock}</Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, 1)}
                  >
                    <Ionicons name="add" size={18} color="#111827" />
                  </TouchableOpacity>
                </View>
                <View style={styles.priceContainer}>
                  <Ionicons name="pricetag" size={14} color="#6b7280" />
                  <Text style={styles.priceLabel}>Precio:</Text>
                  <Text style={styles.productPrice}>${(item.finalPrice || item.price || 0).toFixed(2)}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeItem(item._id, item.size)}
              >
                <Ionicons name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.checkoutSection}>
        <View style={styles.checkoutPanel}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceder a pago</Text>
          </TouchableOpacity>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos para el carrito vacío
  emptyContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  headerSimple: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cartImage: {
    width: 160,
    height: 200,
    marginBottom: 24,
    opacity: 0.8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  subText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginBottom: 32,
    marginHorizontal: 32,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Estilos para el carrito con productos
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  cartHeader: {
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  itemCount: {
    backgroundColor: '#111827',
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
    color: '#111827',
  },
  productList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productItem: {
    marginBottom: 15,
    borderRadius: 16,
  },
  productCard: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
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
    color: '#6b7280',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  checkoutPanel: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  checkoutButton: {
    marginTop: 8,
    backgroundColor: '#000',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  
  // Estilos para medidas
  measurementsContainer: {
    marginBottom: 8,
  },
  measurementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  measuresList: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  measureLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  measureValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
});

export default CartScreen; 