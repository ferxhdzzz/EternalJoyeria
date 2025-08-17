import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState('20 mm');

  const sizes = ['15 mm', '20 mm', '10 mm'];

  const handleAddToCart = () => {
    // Crear el producto con la talla seleccionada
    const productToAdd = {
      ...product,
      size: selectedSize,
      price: 55.00, // Precio con descuento
      originalPrice: 58.00,
    };
    
    console.log('Producto a añadir:', JSON.stringify(productToAdd));
    
    // Navegar a MainTabs y cambiar a la pestaña Carrito
    navigation.navigate('MainTabs', { 
      screen: 'Carrito',
      params: { newProduct: productToAdd }
    });
    
    // Mostrar confirmación
    alert('Producto añadido al carrito');
  };

  return (
    <View style={styles.container}>
      {/* Header con botones */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Reviews', { product })}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Área de imagen del producto */}
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Tarjeta de información del producto */}
      <View style={styles.productCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nombre del producto */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Selección de talla */}
          <View style={styles.sizeSection}>
            <Text style={styles.sizeLabel}>Talla</Text>
            <View style={styles.sizeOptions}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.sizeOptionSelected
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Precios y descuento */}
          <View style={styles.pricingSection}>
            <View style={styles.discountRow}>
              <Text style={styles.discountText}>30% descuento</Text>
              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>$58</Text>
                <Text style={styles.discountedPrice}>$55</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Botón de añadir al carrito - Posicionado absolutamente */}
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE7E7', // Color de fondo suave como en la imagen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  productImage: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginLeft: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 25,
    minHeight: height * 0.35,
    overflow: 'visible',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  sizeSection: {
    marginBottom: 20,
  },
  sizeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
    alignItems: 'center',
  },
  sizeOptionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sizeTextSelected: {
    color: '#FFFFFF',
  },
  pricingSection: {
    marginBottom: 25,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6', // Color morado para el descuento
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B5C9AD', // Color verde/amarillento como en la imagen
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    backgroundColor: '#000',
    paddingVertical: 22,
    paddingHorizontal: 35,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 