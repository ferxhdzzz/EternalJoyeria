import React, { useMemo, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchCategories from '../hooks/useFetchCategories';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Obtener datos del usuario logueado desde AuthContext
  const { user } = useContext(AuthContext);

  // Hooks de datos
  const {
    productos,
    loading: loadingProducts,
    refreshProductos,
  } = useFetchProducts();

  const {
    categories,
    loading: loadingCategories,
    refreshCategories,
  } = useFetchCategories();

  // Función para refrescar
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshProductos(), refreshCategories()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Cuando cambia la categoría, pedir datos al backend (usa endpoint por categoría)
  useEffect(() => {
    if (selectedCategory === 'todos') {
      refreshProductos(null);
    } else {
      refreshProductos(selectedCategory);
    }
  }, [selectedCategory]);

  // Filtrar productos por categoría seleccionada (defensa extra si llega todo el listado)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productos)) return [];
    if (selectedCategory === 'todos') return productos;
    // Backend: campo de categoría es category_id. Convertimos a string por si viene como ObjectId
    const sel = String(selectedCategory);
    return productos.filter((p) => {
      const cat = p.category_id ?? p.categoryId ?? p.category;
      const catId = (cat && typeof cat === 'object') ? (cat._id ?? cat.id ?? null) : cat;
      return catId != null && String(catId) === sel;
    });
  }, [productos, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={(user?.profilePicture || user?.profileImage)
              ? { uri: user.profilePicture || user.profileImage }
              : require('../../assets/Usuarionuevo.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeLabel}>Bienvenido/a</Text>
            <Text style={styles.userName}>{user?.name || user?.firstName || user?.email?.split('@')[0] || 'Usuario'}</Text>
          </View>
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Categorías</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {(categories?.length ? categories : [{ _id: 'todos', name: 'Todos' }]).map((cat) => {
            const id = cat._id || cat.id;
            const name = cat.name || 'Categoría';
            const active = (selectedCategory || 'todos') === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.categoryButton, active && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(id)}
                disabled={loadingCategories}
              >
                <Text style={[styles.categoryButtonText, active && styles.categoryButtonTextActive]}>
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Productos */}
      <ScrollView
        style={styles.productsSection}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#B5C9AD']}
            tintColor="#B5C9AD"
          />
        }
      >
        {loadingProducts ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="time-outline" size={40} color="#999" />
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : filteredProducts?.length ? (
          <View style={styles.grid}>
            {filteredProducts.map((prod) => {
              const imageUrl = Array.isArray(prod.images) && prod.images.length ? prod.images[0] : prod.image;
              const priceValue = prod.finalPrice != null ? prod.finalPrice : prod.price;
              return (
                <TouchableOpacity
                  key={prod._id || prod.id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ProductDetail', { productId: prod._id || prod.id })}
                >
                  <Image
                    source={imageUrl ? { uri: imageUrl } : require('../../assets/icon.png')}
                    style={styles.cardImage}
                  />
                  <Text numberOfLines={1} style={styles.cardTitle}>{prod.name || prod.title}</Text>
                  <Text style={styles.cardPrice}>${Number(priceValue || 0).toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.noProductsContainer}>
            <Ionicons name="bag-outline" size={48} color="#ccc" />
            <Text style={styles.noProductsText}>No hay productos para mostrar</Text>
            <Text style={styles.debugText}>Usuario: {user?.email || 'No logueado'}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
    backgroundColor: '#FFDDDD',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#E8B4B8',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#000',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 20 - 20 - 12) / 2, // padding horizontal - gutter
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 10,
    marginBottom: 12,
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
});

export default ProductScreen;
