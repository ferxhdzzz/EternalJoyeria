import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route, userData }) => {
  const navigation = route.params?.navigation;
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Categorías disponibles
  const categories = ['Todos', 'Collares', 'Aretes', 'Pulseras', 'Conjuntos', 'Peinetas'];

  // Datos de ejemplo para productos por categoría
  const [products] = useState([
    // Collares
    {
      id: 1,
      name: 'Collar de Perlas',
      price: 89.99,
      image: require('../../assets/Productos/collarorchidmorado.png'),
      category: 'Collares'
    },
    {
      id: 2,
      name: 'Collar Dorado',
      price: 129.99,
      image: require('../../assets/Productos/collarorchidrosado.png'),
      category: 'Collares'
    },
    // Aretes
    {
      id: 3,
      name: 'Aretes de Diamante',
      price: 199.99,
      image: require('../../assets/Productos/aretedoradomargarita.png'),
      category: 'Aretes'
    },
    {
      id: 4,
      name: 'Aretes de Plata',
      price: 79.99,
      image: require('../../assets/Productos/aretedoradorosa.png'),
      category: 'Aretes'
    },
    // Pulseras
    {
      id: 5,
      name: 'Pulsera Elegante',
      price: 149.99,
      image: require('../../assets/Productos/pulserauna.png'),
      category: 'Pulseras'
    },
    {
      id: 6,
      name: 'Pulsera de Oro',
      price: 299.99,
      image: require('../../assets/Productos/pulserados.png'),
      category: 'Pulseras'
    },
    // Conjuntos
    {
      id: 7,
      name: 'Set Completo',
      price: 399.99,
      image: require('../../assets/Productos/conjuntoorchidblanco.png'),
      category: 'Conjuntos'
    },
    {
      id: 8,
      name: 'Colección Premium',
      price: 599.99,
      image: require('../../assets/Productos/conjuntoorchidamarillo.png'),
      category: 'Conjuntos'
    },
    // Peinetas
    {
      id: 9,
      name: 'Peineta Decorativa',
      price: 45.99,
      image: require('../../assets/Productos/peinetarosa.png'),
      category: 'Peinetas'
    },
    {
      id: 10,
      name: 'Peineta Elegante',
      price: 65.99,
      image: require('../../assets/Productos/peinetablanca.png'),
      category: 'Peinetas'
    }
  ]);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonSelected
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextSelected
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = (product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image 
          source={typeof product.image === 'string' ? { uri: product.image } : product.image} 
          style={styles.productImage} 
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => navigation.navigate('ProductDetail', { product })}
      >
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderCategorySection = (category) => {
    // Si la categoría es "Todos", mostrar todos los productos juntos
    if (category === 'Todos') {
      return (
        <View key={category} style={styles.categorySection}>
          <View style={styles.productsGrid}>
            {products.map(renderProduct)}
          </View>
        </View>
      );
    }
    
    // Para otras categorías, filtrar por categoría
    const categoryProducts = products.filter(product => product.category === category);
    
    if (categoryProducts.length === 0) return null;

    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.productsGrid}>
          {categoryProducts.map(renderProduct)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.profileSection}>
          <Image
            source={userData?.profileImage ? { uri: userData.profileImage } : require('../../assets/Usuarionuevo.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeLabel}>Bienvenida</Text>
            <Text style={styles.userName}>{userData?.firstName || 'Jennifer'}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Categorías */}
      <Animated.View
        style={[
          styles.categoriesSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.categoriesTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </Animated.View>

      {/* Productos por Categoría */}
      <Animated.View
        style={[
          styles.productsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {selectedCategory === 'Todos' 
            ? renderCategorySection('Todos')
            : renderCategorySection(selectedCategory)
          }
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  categoriesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#FFDDDD',
    borderColor: '#FFDDDD',
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#D0D5DD',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  productsContainer: {
    paddingBottom: 50,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF2F2',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  productImageContainer: {
    backgroundColor: '#FFF2F2',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: -15,
  },
  productInfo: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: '#B5C9AD',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductScreen; 