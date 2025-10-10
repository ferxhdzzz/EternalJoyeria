import React, { useState, useEffect, useMemo } from 'react';
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Todos los pedidos sin filtrar
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para filtros
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('todos');
  const [selectedDateFilter, setSelectedDateFilter] = useState('todos');


  // Obtener pedidos del usuario
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
        console.log('✅ [OrdersScreen] Datos recibidos:', data.length, 'registros');
        
        // Filtrar solo pedidos reales (no carritos temporales)
        const realOrders = Array.isArray(data) ? data.filter(order => {
          // Excluir solo carritos temporales y drafts
          const isRealOrder = order.status && 
            order.status !== 'cart' && 
            order.status !== 'draft';
          
          console.log(`[OrdersScreen] Orden ${order._id?.slice(-6)}:`, {
            status: order.status,
            paymentStatus: order.paymentStatus,
            isReal: isRealOrder
          });
          
          return isRealOrder;
        }) : [];
        
        console.log('🔍 [OrdersScreen] Pedidos reales:', realOrders.length);
        
        // Ordenar por fecha (más reciente primero)
        const sorted = realOrders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Guardar todos los pedidos para filtros
        setAllOrders(sorted);
        
        // Log detallado de cada pedido para debug
        sorted.forEach((order, index) => {
          console.log(`[OrdersScreen] Pedido ${index + 1}:`, {
            id: order._id?.slice(-6),
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            products: order.products?.length || 0
          });
        });
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

  // Actualizar pedidos al enfocar pantalla
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

  // Definir filtros disponibles
  const statusFilters = [
    { id: 'todos', label: 'Todos', icon: 'list' },
    { id: 'pagado', label: 'Pagado', icon: 'checkmark-circle' },
    { id: 'pendiente', label: 'Pendiente', icon: 'time' },
    { id: 'pending_payment', label: 'Pago Pendiente', icon: 'card' },
    { id: 'En camino', label: 'En Camino', icon: 'car' },
    { id: 'cancelado', label: 'Cancelado', icon: 'close-circle' },
  ];

  const dateFilters = [
    { id: 'todos', label: 'Todas las fechas', icon: 'calendar' },
    { id: 'semana', label: 'Última semana', icon: 'calendar-outline' },
    { id: 'mes', label: 'Último mes', icon: 'calendar-outline' },
    { id: 'trimestre', label: 'Últimos 3 meses', icon: 'calendar-outline' },
  ];

  // Función para filtrar por fecha
  const filterByDate = (orders, dateFilter) => {
    if (dateFilter === 'todos') return orders;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (dateFilter) {
      case 'semana':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'mes':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'trimestre':
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return orders;
    }
    
    return orders.filter(order => new Date(order.createdAt) >= startDate);
  };

  // Función para filtrar por estado
  const filterByStatus = (orders, statusFilter) => {
    if (statusFilter === 'todos') return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  // Aplicar filtros usando useMemo para optimización
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];
    
    // Aplicar filtro de estado
    filtered = filterByStatus(filtered, selectedStatusFilter);
    
    // Aplicar filtro de fecha
    filtered = filterByDate(filtered, selectedDateFilter);
    
    console.log(`🔍 [OrdersScreen] Filtros aplicados - Estado: ${selectedStatusFilter}, Fecha: ${selectedDateFilter}`);
    console.log(`🔍 [OrdersScreen] Resultados: ${filtered.length}/${allOrders.length} pedidos`);
    
    return filtered;
  }, [allOrders, selectedStatusFilter, selectedDateFilter]);

  // Actualizar orders cuando cambien los filtros
  useEffect(() => {
    setOrders(filteredOrders);
  }, [filteredOrders]);

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
    if (!status) return '#9CA3AF';
    
    const s = String(status).toLowerCase().trim();
    console.log('[OrdersScreen] Estado del pedido:', status);
    
    // Solo 3 estados básicos
    if (s === 'pagado') return '#16a34a';      // Verde
    if (s === 'pendiente') return '#f59e0b';   // Amarillo  
    if (s === 'no pagado') return '#ef4444';   // Rojo
    
    // Si no coincide con ninguno, usar gris
    return '#9CA3AF';
  };

  const getStatusText = (status) => {
    if (!status) return 'Desconocido';
    
    // Mostrar exactamente lo que viene del backend
    console.log('[OrdersScreen] Mostrando estado:', status);
    return String(status);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <View style={styles.orderCardInner}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <View style={styles.orderNumberContainer}>
              <Ionicons name="document-text" size={16} color="#6b7280" />
              <Text style={styles.orderNumber}>#{item._id.slice(-6).toUpperCase()}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="time" size={14} color="#6b7280" />
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
                    source={product.productId?.images?.[0] ? { uri: product.productId.images[0] } : require('../../assets/Productos/peinetarosa.png')}
                    style={styles.productImage}
                    defaultSource={require('../../assets/Productos/peinetarosa.png')}
                  />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.productId?.name || 'Producto'}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <Ionicons name="cube" size={12} color="#6b7280" />
                    <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
            {item.products.length > 2 && (
              <View style={styles.moreProductsContainer}>
                <Ionicons name="ellipsis-horizontal" size={16} color="#6b7280" />
                <Text style={styles.moreProducts}>
                  +{item.products.length - 2} productos más
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Ionicons name="calculator" size={16} color="#6b7280" />
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${(item.total || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.viewDetailButton}>
          <Ionicons name="eye" size={16} color="#111827" />
          <Text style={styles.viewDetailText}>Ver detalles</Text>
          <Ionicons name="chevron-forward" size={16} color="#111827" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Componente para filtros de estado
  const renderStatusFilters = () => (
    <View style={styles.filtersSection}>
      <Text style={styles.filterSectionTitle}>Filtrar por estado:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {statusFilters.map((filter) => {
          const isSelected = selectedStatusFilter === filter.id;
          const count = filter.id === 'todos' 
            ? allOrders.length 
            : allOrders.filter(order => order.status === filter.id).length;
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterButton, isSelected && styles.filterButtonActive]}
              onPress={() => setSelectedStatusFilter(filter.id)}
            >
              <Ionicons 
                name={filter.icon} 
                size={16} 
                color={isSelected ? '#fff' : '#6b7280'} 
              />
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter.label}
              </Text>
              {count > 0 && (
                <View style={[styles.filterBadge, isSelected && styles.filterBadgeActive]}>
                  <Text style={[styles.filterBadgeText, isSelected && styles.filterBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Componente para filtros de fecha
  const renderDateFilters = () => (
    <View style={styles.filtersSection}>
      <Text style={styles.filterSectionTitle}>Filtrar por fecha:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {dateFilters.map((filter) => {
          const isSelected = selectedDateFilter === filter.id;
          const filteredByDate = filterByDate(allOrders, filter.id);
          const count = filter.id === 'todos' 
            ? allOrders.length 
            : filteredByDate.length;
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterButton, isSelected && styles.filterButtonActive]}
              onPress={() => setSelectedDateFilter(filter.id)}
            >
              <Ionicons 
                name={filter.icon} 
                size={16} 
                color={isSelected ? '#fff' : '#6b7280'} 
              />
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter.label}
              </Text>
              {count > 0 && (
                <View style={[styles.filterBadge, isSelected && styles.filterBadgeActive]}>
                  <Text style={[styles.filterBadgeText, isSelected && styles.filterBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Componente para limpiar filtros
  const renderClearFilters = () => {
    const hasActiveFilters = selectedStatusFilter !== 'todos' || selectedDateFilter !== 'todos';
    
    if (!hasActiveFilters) return null;
    
    return (
      <View style={styles.clearFiltersContainer}>
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() => {
            setSelectedStatusFilter('todos');
            setSelectedDateFilter('todos');
          }}
        >
          <Ionicons name="refresh" size={16} color="#ef4444" />
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
        <Text style={styles.resultsCount}>
          {orders.length} de {allOrders.length} pedidos
        </Text>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}> 
      <View style={styles.emptyHeader}><Text style={styles.headerTitle}>Mis Pedidos</Text></View>
      <View style={styles.emptyContent}>
        <Ionicons name="receipt-outline" size={80} color="#6b7280" />
        <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
        <Text style={styles.emptySubtitle}>Realiza tu primera compra</Text>
        <TouchableOpacity style={styles.startShoppingCta} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.startShoppingCtaText}>Comenzar a comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'rgba(255, 221, 221, 0.37)' }]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#999" />
          <Text style={[styles.loadingText, { color: '#6b7280' }]}>Cargando tus pedidos...</Text>
        </View>
      </View>
    );
  }

  // Componente para estado vacío
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bag-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
      <Text style={styles.emptySubtitle}>
        Cuando realices tu primera compra,{'\n'}tus pedidos aparecerán aquí
      </Text>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="storefront" size={20} color="#fff" />
        <Text style={styles.shopButtonText}>Comenzar a Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>

      {/* Filtros */}
      {allOrders.length > 0 && (
        <View style={styles.filtersWrapper}>
          {renderStatusFilters()}
          {renderDateFilters()}
          {renderClearFilters()}
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={orders.length === 0 ? styles.emptyListContainer : styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000']}
            tintColor="#000"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  headerBar: {
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  orderCardInner: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  orderContent: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  productsList: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f9fafb',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreProducts: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingVertical: 16,
    marginTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  moreProductsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  emptyHeader: {
    paddingTop: 56,
    paddingBottom: 12,
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  startShoppingCta: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startShoppingCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Estilos para filtros
  filtersWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  filtersContainer: {
    paddingRight: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterBadgeTextActive: {
    color: '#fff',
  },
  clearFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
  },
  resultsCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default OrdersScreen;
