import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const { width, height } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { products, loading } = useProducts();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);
    
    const timer = setTimeout(() => {
      animation.start(() => setIsAnimationComplete(true));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrar productos basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      productName: product.name 
    });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.cardContainer}>
      <ProductCard 
        product={item} 
        onPress={handleProductPress}
      />
    </View>
  );

  const categories = [
    { id: 'all', name: 'Todas', icon: 'diamond-outline' },
    { id: 'rings', name: 'Anillos', icon: 'radio-button-off-outline' },
    { id: 'necklaces', name: 'Collares', icon: 'ellipse-outline' },
    { id: 'earrings', name: 'Aretes', icon: 'leaf-outline' },
    { id: 'bracelets', name: 'Pulseras', icon: 'remove-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b4513" />
      
      <LinearGradient
        colors={['#fef7e7', '#fdf4e3', '#fcf1df']}
        style={styles.background}
      >
        {/* Elementos decorativos */}
        {isAnimationComplete && (
          <>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
          </>
        )}

        {/* Header Elegante */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Buscar Joyas</Text>
            <View style={styles.logoUnderline} />
          </View>
          <Text style={styles.welcomeSubtitle}>
            Encuentra la joya perfecta para ti
          </Text>
        </Animated.View>

        {/* Barra de búsqueda */}
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#d4af37" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar joyas, anillos, collares..."
              placeholderTextColor="#a0522d"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color="#8b4513" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categorías */}
        <Animated.View style={[styles.categoriesContainer, { opacity: fadeAnim }]}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Ionicons 
                  name={item.icon} 
                  size={18} 
                  color={selectedCategory === item.id ? '#fff' : '#d4af37'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextActive
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </Animated.View>

        {/* Resultados */}
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          {searchQuery.trim() === '' ? (
            <View style={styles.emptySearchContainer}>
              <Ionicons name="search-outline" size={80} color="#d4af37" />
              <Text style={styles.emptySearchTitle}>Busca tu joya ideal</Text>
              <Text style={styles.emptySearchText}>
                Escribe el nombre de la joya que buscas o explora por categorías
              </Text>
            </View>
          ) : isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d4af37" />
              <Text style={styles.loadingText}>Buscando joyas...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="sad-outline" size={60} color="#d4af37" />
              <Text style={styles.noResultsTitle}>No encontramos joyas</Text>
              <Text style={styles.noResultsText}>
                No hay joyas que coincidan con "{searchQuery}"
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'joya encontrada' : 'joyas encontradas'}
                </Text>
              </View>
              <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7e7',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#b8860b',
    marginTop: 6,
    borderRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#8b4513',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#d4af37',
    borderColor: '#b8860b',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b4513',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptySearchTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8b4513',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8b4513',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b4513',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#a0522d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    marginBottom: 15,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b4513',
    textAlign: 'center',
  },
  resultsList: {
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    maxWidth: '50%',
    padding: 6,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    top: -50,
    right: -50,
    zIndex: 0,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(184, 134, 11, 0.06)',
    bottom: -100,
    left: -100,
    zIndex: 0,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 69, 19, 0.08)',
    top: '50%',
    right: -30,
    zIndex: 0,
  },
});

export default SearchScreen;