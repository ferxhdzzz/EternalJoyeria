import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funcion para traducir tallas al español
  const translateSize = (size) => {
    if (!size || typeof size !== 'string') return 'Talla única';
    
    const sizeTranslations = {
      // Tallas descriptivas
      'Small': 'Pequeña',
      'Medium': 'Mediana', 
      'Large': 'Grande',
      'Extra Small': 'Extra Pequeña',
      'Extra Large': 'Extra Grande',
      
      // Tallas únicas
      'One Size': 'Talla única',
      'Unique': 'Talla única',
      'Unica': 'Talla única',
      'Free Size': 'Talla libre',
      'Adjustable': 'Ajustable',
      
      // Tallas estándar (se mantienen)
      'XS': 'XS',
      'S': 'S', 
      'M': 'M',
      'L': 'L',
      'XL': 'XL',
      'XXL': 'XXL',
    };
    
    return sizeTranslations[size] || size;
  };

  // Funcion para obtener nombre de medida en español
  const sizeDisplayName = (k) => {
    const map = { weight: 'Peso', height: 'Altura', width: 'Ancho' };
    return map[k] || String(k);
  };

  // Funcion para formatear medidas con unidades (incluyendo width)
  const formatMeasurement = (key, val) => {
    if (val == null) return '-';
    const raw = String(val).trim();
    // Si ya viene con unidad, no modificar
    if (/[a-zA-Z]/.test(raw)) return raw;
    const num = Number(raw);
    if (Number.isNaN(num)) return raw;
    if (key === 'weight') {
      // Heurística: <1000 -> gramos, si no -> kg
      if (num < 1000) return `${num} g`;
      const kg = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 2);
      return `${kg} kg`;
    }
    if (key === 'height' || key === 'width') {
      // Altura/Ancho en cm por defecto
      return `${num} cm`;
    }
    // Por defecto, mostrar valor tal cual
    return raw;
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.ORDERS)}/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[OrderDetail] Datos del pedido:', data);
        
        // Obtener datos completos de cada producto incluyendo measurements
        if (data.products && data.products.length > 0) {
          const productsWithMeasurements = await Promise.all(
            data.products.map(async (product) => {
              try {
                const productId = product.productId?._id || product.productId;
                if (productId) {
                  const productResponse = await fetch(`${buildApiUrl(API_ENDPOINTS.PRODUCTS)}/${productId}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (productResponse.ok) {
                    const fullProduct = await productResponse.json();
                    console.log('[OrderDetail] Producto completo:', fullProduct);
                    return {
                      ...product,
                      productId: fullProduct.product || fullProduct
                    };
                  }
                }
                return product;
              } catch (error) {
                console.error('[OrderDetail] Error obteniendo producto:', error);
                return product;
              }
            })
          );
          
          data.products = productsWithMeasurements;
        }
        
        setOrder(data);
      } else {
        console.error('Error al obtener detalle del pedido:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar detalle del pedido:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Ionicons name="receipt-outline" size={60} color="#666" />
          <ActivityIndicator size="large" color="#666" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Cargando detalle del pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#2d2d2d" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Detalle del Pedido</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>Error al cargar el pedido</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#2d2d2d" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        {/* Informacion del pedido */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>
                Pedido #{order._id.slice(-6).toUpperCase()}
              </Text>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>

          {order.wompiReference && (
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceLabel}>Referencia de pago:</Text>
              <Text style={styles.referenceValue}>{order.wompiReference}</Text>
            </View>
          )}
        </View>

        {/* Productos del pedido */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Productos ({order.products.length})</Text>
          
          {order.products.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ 
                    uri: product.productId?.images?.[0] || 
                         `${BACKEND_URL}${product.productId?.images?.[0]}` 
                  }}
                  style={styles.productImage}
                  defaultSource={require('../../assets/Productos/peinetarosa.png')}
                  resizeMode="cover"
                />
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.productId?.name || 'Producto'}
                </Text>
                
                
                {/* Medidas del producto si existen - IGUAL QUE PRODUCTDETAILSCREEN */}
                {(() => {
                  console.log('[OrderDetail] Producto completo:', product);
                  console.log('[OrderDetail] productId:', product.productId);
                  console.log('[OrderDetail] productId.measurements:', product.productId?.measurements);
                  console.log('[OrderDetail] product.measurements:', product.measurements);
                  return null;
                })()}
                {product.productId?.measurements && (
                  <View style={styles.measurementsContainer}>
                    <Text style={styles.measurementsTitle}>Medidas</Text>
                    <View style={styles.measurementsList}>
                      {Object.entries(product.productId.measurements).map(([key, value]) => (
                        <View key={String(key)} style={styles.measurementRow}>
                          <Text style={styles.measurementLabel}>{sizeDisplayName(key)}:</Text>
                          <Text style={styles.measurementValue}>{formatMeasurement(key, value)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={styles.productMeta}>
                  <View style={styles.quantityInfo}>
                    <Text style={styles.quantityLabel}>Cantidad:</Text>
                    <Text style={styles.quantityValue}>{product.quantity}</Text>
                  </View>
                  
                  <View style={styles.priceInfo}>
                    <Text style={styles.unitPrice}>
                      ${((product.unitPriceCents || 0) / 100).toFixed(2)} c/u
                    </Text>
                    <Text style={styles.subtotalPrice}>
                      ${((product.subtotalCents || 0) / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Informacion de envio */}
        {order.shippingAddress && (
          <View style={styles.shippingSection}>
            <Text style={styles.sectionTitle}>Información de Envío</Text>
            <View style={styles.shippingCard}>
              <View style={styles.addressRow}>
                <Ionicons name="person-outline" size={18} color="#666" />
                <Text style={styles.addressText}>{order.shippingAddress.name}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="call-outline" size={18} color="#666" />
                <Text style={styles.addressText}>{order.shippingAddress.phone}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="mail-outline" size={18} color="#666" />
                <Text style={styles.addressText}>{order.shippingAddress.email}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color="#666" />
                <Text style={styles.addressText}>
                  {order.shippingAddress.line1}, {order.shippingAddress.city}
                </Text>
              </View>
              {order.shippingAddress.zip && (
                <View style={styles.addressRow}>
                  <Ionicons name="mail-outline" size={18} color="#666" />
                  <Text style={styles.addressText}>CP: {order.shippingAddress.zip}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Resumen de costos */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${(((order.totalCents || 0) - (order.shippingCents || 0) - (order.taxCents || 0) + (order.discountCents || 0)) / 100).toFixed(2)}
              </Text>
            </View>
            {order.shippingCents > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValue}>
                  ${((order.shippingCents || 0) / 100).toFixed(2)}
                </Text>
              </View>
            )}
            {order.taxCents > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Impuestos:</Text>
                <Text style={styles.summaryValue}>
                  ${((order.taxCents || 0) / 100).toFixed(2)}
                </Text>
              </View>
            )}
            {order.discountCents > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Descuento:</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -${((order.discountCents || 0) / 100).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${(order.total || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Informacion del pedido
  orderInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2d2d',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  referenceContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  referenceLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d2d2d',
    fontFamily: 'monospace',
  },
  // Seccion de productos
  productsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  // Estilos para tallas mejoradas
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sizeLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginRight: 6,
  },
  sizeValue: {
    fontSize: 13,
    color: '#2d2d2d',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Estilos para medidas mejoradas
  measurementsContainer: {
    marginBottom: 8,
  },
  measurementsTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  measurementsList: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  measurementValue: {
    fontSize: 12,
    color: '#2d2d2d',
    fontWeight: '600',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginRight: 4,
  },
  quantityValue: {
    fontSize: 13,
    color: '#2d2d2d',
    fontWeight: '600',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  subtotalPrice: {
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: '700',
  },
  // Seccion de envio
  shippingSection: {
    marginBottom: 16,
  },
  shippingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#2d2d2d',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  // Seccion de resumen
  summarySection: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#2d2d2d',
    fontWeight: '600',
  },
  discountValue: {
    color: '#28a745',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2d2d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default OrderDetailScreen;
