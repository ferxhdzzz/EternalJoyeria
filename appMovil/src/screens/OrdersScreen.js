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
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = 'http://192.168.56.1.200:4000';

  // Función para obtener pedidos del usuario
  const fetchUserOrders = async () => {
    try {
      console.log('🔄 [OrdersScreen] Iniciando fetchUserOrders...');
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔑 [OrdersScreen] Token:', token ? 'Presente' : 'No encontrado');
      
      const url = `${BACKEND_URL}/api/orders/user`;
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
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Pedido #{item._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <View style={styles.productsList}>
          {item.products.slice(0, 2).map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Image
                source={{ uri: product.productId?.images?.[0] }}
                style={styles.productImage}
                defaultSource={require('../../assets/Productos/peinetarosa.png')}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.productId?.name || 'Producto'}
                </Text>
                <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
              </View>
            </View>
          ))}
          {item.products.length > 2 && (
            <Text style={styles.moreProducts}>
              +{item.products.length - 2} productos más
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.orderPrice}>${(item.total || 0).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.viewDetailButton}>
        <Text style={styles.viewDetailText}>Ver detalles</Text>
        <Ionicons name="chevron-forward" size={16} color="#E8B4CB" />
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color="#E8B4CB" />
      <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
      <Text style={styles.emptySubtitle}>Realiza tu primera compra y aparecerá aquí</Text>
      <TouchableOpacity style={styles.startShoppingButton} onPress={() => navigation.navigate('Inicio')}>
        <Text style={styles.startShoppingText}>Comenzar a comprar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFE7E7', '#FFFFFF']}
        style={styles.loadingContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ActivityIndicator size="large" color="#E8B4CB" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFE7E7', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <Text style={styles.headerSubtitle}>
          {user?.firstName}, aquí están tus compras
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  orderDate: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  productQuantity: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  moreProducts: {
    fontSize: 14,
    color: '#E8B4CB',
    fontWeight: '500',
    marginTop: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#6C757D',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8B4CB',
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 16,
  },
  viewDetailText: {
    fontSize: 16,
    color: '#E8B4CB',
    fontWeight: '500',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#E8B4CB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen;
