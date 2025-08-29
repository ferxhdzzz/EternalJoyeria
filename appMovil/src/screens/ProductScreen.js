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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchCategories from '../hooks/useFetchCategories';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route, userData }) => {
  const navigation = route.params?.navigation;
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Usa los hooks para obtener productos y categorías
  const { productos, loading: productsLoading, error: productsError, refreshProductos } = useFetchProducts(); 
  const { categories, loading: categoriesLoading, error: categoriesError, refreshCategories } = useFetchCategories();

  // Debug: mostrar datos en consola
  useEffect(() => {
    if (productos.length > 0) {
      console.log('=== PRODUCTOS CARGADOS ===');
      console.log('Total productos:', productos.length);
      productos.forEach((product, index) => {
        console.log(`Producto ${index + 1}:`, {
          name: product.name,
          category_id: product.category_id,
          category_id_type: typeof product.category_id,
          category_name: product.category_id?.name,
          category_id_id: product.category_id?._id
        });
      });
    }
  }, [productos]);

  useEffect(() => {
    if (categories.length > 0) {
      console.log('=== CATEGORÍAS CARGADAS ===');
      console.log('Total categorías:', categories.length);
      categories.forEach((category, index) => {
        console.log(`Categoría ${index + 1}:`, {
          name: category.name,
          _id: category._id,
          _id_type: typeof category._id
        });
      });
    }
  }, [categories]);

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
  }, [fadeAnim, slideAnim]);

  // Función para refrescar todo
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshProductos(), refreshCategories()]);
    setRefreshing(false);
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category._id}
      style={[
        styles.categoryButton,
        selectedCategory === category.name && styles.categoryButtonSelected
      ]}
      onPress={() => setSelectedCategory(category.name)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.name && styles.categoryButtonTextSelected
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = (product) => (
    <View key={product._id} style={styles.productCard}> 
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name || 'Producto sin nombre'}
        </Text>
        <Text style={styles.productPrice}>
          ${(product.finalPrice || product.price || 0).toFixed(2)}
        </Text> 
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => {
          if (navigation?.navigate) {
            navigation.navigate('ProductDetail', { product });
          }
        }}
      >
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderCategorySection = (categoryName) => {
    // Si la categoría es "Todos", mostrar todos los productos
    let categoryProducts;
    
    if (categoryName === 'Todos') {
      categoryProducts = productos;
    } else {
      // Buscar la categoría seleccionada en la lista de categorías
      const selectedCategoryObj = categories.find(cat => cat.name === categoryName);
      
      if (selectedCategoryObj && selectedCategoryObj._id !== 'todos') {
        // Filtrar productos por category_id (el backend devuelve el objeto completo)
        categoryProducts = productos.filter(product => {
          // El backend hace populate, así que category_id es un objeto con _id y name
          const productCategoryName = product.category_id?.name;
          const categoryName = selectedCategoryObj.name;
          
          console.log(`Comparando: producto.category_id.name = "${productCategoryName}" con categoría.name = "${categoryName}"`);
          return productCategoryName === categoryName;
        });
      } else {
        categoryProducts = [];
      }
    }
    
    console.log(`Categoría "${categoryName}": ${categoryProducts.length} productos encontrados`);
    
    if (categoryProducts.length === 0) {
      return (
        <View key={categoryName} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <View style={styles.noProductsContainer}>
            <Ionicons name="bag-outline" size={48} color="#ccc" />
            <Text style={styles.noProductsText}>
              No hay productos en esta categoría
            </Text>
            <Text style={styles.debugText}>
              Debug: {productos.length} productos total, {categories.length} categorías
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={categoryName} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        <View style={styles.productsGrid}>
          {categoryProducts.map(renderProduct)}
        </View>
      </View>
    );
  };

  // Renderizar mensaje de error para productos
  if (productsError && !productsLoading) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Error al cargar productos</Text>
        <Text style={styles.errorMessage}>{productsError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProductos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizar mensaje de error para categorías
  if (categoriesError && !categoriesLoading) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Error al cargar categorías</Text>
        <Text style={styles.errorMessage}>{categoriesError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshCategories}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {categoriesLoading ? (
          <ActivityIndicator size="small" color="#B5C9AD" style={styles.categoryLoading} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        )}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#B5C9AD']}
              tintColor="#B5C9AD"
            />
          }
        >
          {productsLoading ? (
            <ActivityIndicator size="large" color="#B5C9AD" style={styles.loadingIndicator} />
          ) : (
            selectedCategory === 'Todos' 
              ? renderCategorySection('Todos')
              : renderCategorySection(selectedCategory)
          )}
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
  loadingIndicator: {
    marginTop: 50,
  },
  categoryLoading: {
    marginTop: 20,
  },
  // Estilos para manejo de errores
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#B5C9AD',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noProductsContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingVertical: 40,
  },
  noProductsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ProductScreen; 