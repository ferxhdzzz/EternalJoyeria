import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  // Función para obtener pedidos del usuario
  const fetchUserOrders = async () => {
    try {
      console.log('🔄 [OrdersScreen] Iniciando fetchUserOrders...');
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔑 [OrdersScreen] Token:', token ? 'Presente' : 'No encontrado');
      
      const url = `${buildApiUrl(API_ENDPOINTS.ORDERS)}/user`;
      console.log('📡 [OrdersScreen] URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 [OrdersScreen] Status:', response.status);
      console.log('📊 [OrdersScreen] OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [OrdersScreen] Datos recibidos:', data.length, 'pedidos');
        
        // Filtrar solo pedidos pagados y ordenar por fecha más reciente
        const paidOrders = data.filter(order => order.status === 'pagado')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('📦 [OrdersScreen] Pedidos pagados:', paidOrders.length);
        setOrders(paidOrders);
      } else {
        const errorText = await response.text();
        console.error('❌ [OrdersScreen] Error:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ [OrdersScreen] Catch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Actualizar pedidos cuando la pantalla esté en foco
  useFocusEffect(
    React.useCallback(() => {
      fetchUserOrders();
    }, [])
  );

  // Cargar datos iniciales
  useEffect(() => {
    fetchUserOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserOrders();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pagado':
        return '#4CAF50';
      case 'pending_payment':
        return '#FF9800';
      case 'no pagado':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pagado':
        return 'Pagado';
      case 'pending_payment':
        return 'Pendiente';
      case 'no pagado':
        return 'No pagado';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 230, 255, 0.8)']}
        style={styles.orderGradient}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <View style={styles.orderNumberContainer}>
              <Ionicons name="diamond" size={16} color="#e91e63" />
              <Text style={styles.orderNumber}>#{item._id.slice(-6).toUpperCase()}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="time" size={14} color="#8e24aa" />
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name="checkmark-circle" size={14} color="#fff" />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.productsList}>
            {item.products.slice(0, 2).map((product, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.productId?.images?.[0] }}
                    style={styles.productImage}
                    defaultSource={require('../../assets/Productos/peinetarosa.png')}
                  />
                  <View style={styles.imageOverlay} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.productId?.name || 'Producto'}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <Ionicons name="cube" size={12} color="#8e24aa" />
                    <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
            {item.products.length > 2 && (
              <View style={styles.moreProductsContainer}>
                <Ionicons name="ellipsis-horizontal" size={16} color="#e91e63" />
                <Text style={styles.moreProducts}>
                  +{item.products.length - 2} productos más
                </Text>
              </View>
            )}
          </View>

          <View style={styles.orderFooter}>
            <View style={styles.totalContainer}>
              <Ionicons name="calculator" size={16} color="#4a148c" />
              <Text style={styles.totalLabel}>Total:</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.orderPrice}>${(item.total || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.viewDetailButton}>
          <Ionicons name="eye" size={16} color="#e91e63" />
          <Text style={styles.viewDetailText}>Ver detalles</Text>
          <Ionicons name="chevron-forward" size={16} color="#e91e63" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Ionicons name="diamond-outline" size={80} color="#8e24aa" />
        <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
        <Text style={styles.emptySubtitle}>Realiza tu primera compra de joyas exclusivas</Text>
        <LinearGradient
          colors={['#e91e63', '#ad1457']}
          style={styles.startShoppingButton}
        >
          <TouchableOpacity 
            style={styles.startShoppingTouchable}
            onPress={() => navigation.navigate('Inicio')}
          >
            <Ionicons name="bag-add" size={20} color="#fff" />
            <Text style={styles.startShoppingText}>Comenzar a comprar</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#f8bbd9', '#e1bee7', '#ce93d8']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <Ionicons name="diamond-outline" size={60} color="#4a148c" />
          <ActivityIndicator size="large" color="#6a1b9a" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Cargando tus pedidos...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f8bbd9', '#e1bee7', '#ce93d8']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="receipt" size={32} color="#4a148c" />
          <Text style={styles.headerTitle}>Mis Pedidos</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {user?.firstName}, aquí están tus compras exclusivas
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E8B4CB']}
              tintColor="#E8B4CB"
            />
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#4a148c',
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6a1b9a',
    textAlign: 'center',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  orderGradient: {
    padding: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  orderDate: {
    fontSize: 12,
    color: '#8e24aa',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderContent: {
    marginBottom: 16,
  },
  productsList: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 12,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ab47bc',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#8e24aa',
    fontWeight: '500',
  },
  moreProductsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  moreProducts: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(171, 71, 188, 0.2)',
    marginTop: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#4a148c',
    fontWeight: '600',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(171, 71, 188, 0.2)',
    marginTop: 16,
    gap: 8,
  },
  viewDetailText: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  startShoppingButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  startShoppingTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 10,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default OrdersScreen;
