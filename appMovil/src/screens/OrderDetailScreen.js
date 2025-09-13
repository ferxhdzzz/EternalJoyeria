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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://192.168.1.200:4000';

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
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

  if (!order) {
    return (
      <LinearGradient
        colors={['#FFE7E7', '#FFFFFF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar el pedido</Text>
        </View>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información del pedido */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <View>
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

        {/* Productos */}
        <View style={styles.productsCard}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {order.products.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: product.productId?.images?.[0] }}
                  style={styles.productImage}
                  defaultSource={require('../../assets/Productos/peinetarosa.png')}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productDetails}>
                <View style={styles.productInfoRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.productId?.name || 'Producto'}
                    </Text>
                    {product.variant?.size && (
                      <Text style={styles.productVariant}>Talla: {product.variant.size}</Text>
                    )}
                    <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
                    <Text style={styles.productPrice}>
                      ${((product.unitPriceCents || 0) / 100).toFixed(2)} c/u
                    </Text>
                  </View>
                  <Text style={styles.productSubtotal}>
                    ${((product.subtotalCents || 0) / 100).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Información de envío */}
        {order.shippingAddress && (
          <View style={styles.shippingCard}>
            <Text style={styles.sectionTitle}>Información de Envío</Text>
            <View style={styles.addressContainer}>
              <View style={styles.addressRow}>
                <Ionicons name="person-outline" size={16} color="#6C757D" />
                <Text style={styles.addressText}>{order.shippingAddress.name}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="call-outline" size={16} color="#6C757D" />
                <Text style={styles.addressText}>{order.shippingAddress.phone}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="mail-outline" size={16} color="#6C757D" />
                <Text style={styles.addressText}>{order.shippingAddress.email}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={16} color="#6C757D" />
                <Text style={styles.addressText}>
                  {order.shippingAddress.line1}, {order.shippingAddress.city}
                </Text>
              </View>
              {order.shippingAddress.zip && (
                <View style={styles.addressRow}>
                  <Ionicons name="mail-outline" size={16} color="#6C757D" />
                  <Text style={styles.addressText}>CP: {order.shippingAddress.zip}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Resumen de costos */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Resumen</Text>
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: '700',
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
  referenceContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'monospace',
  },
  productsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  productDetails: {
    flex: 1,
    flexDirection: 'column',
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#6C757D',
  },
  productSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E8B4CB',
  },
  shippingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addressContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6C757D',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2C3E50',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8B4CB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6C757D',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default OrderDetailScreen;
