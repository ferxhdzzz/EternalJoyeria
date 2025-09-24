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
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


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
        colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <Ionicons name="receipt" size={60} color="#ad1457" />
          <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Cargando detalle del pedido...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!order) {
    return (
      <LinearGradient
        colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ad1457" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="receipt" size={28} color="#e91e63" />
            <Text style={styles.headerTitle}>Detalle del Pedido</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={60} color="#ff7043" />
          <Text style={styles.errorText}>Error al cargar el pedido</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3f51b5" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="receipt" size={28} color="#5c6bc0" />
          <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informacion del pedido */}
        <View style={styles.orderInfoCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(232, 234, 246, 0.8)']}
            style={styles.orderInfoGradient}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <View style={styles.orderNumberContainer}>
                  <Ionicons name="diamond" size={18} color="#e91e63" />
                  <Text style={styles.orderNumber}>
                    #{order._id.slice(-6).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="time" size={16} color="#f06292" />
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>

            {order.wompiReference && (
              <View style={styles.referenceContainer}>
                <View style={styles.referenceHeader}>
                  <Ionicons name="card" size={16} color="#e91e63" />
                  <Text style={styles.referenceLabel}>Referencia de pago:</Text>
                </View>
                <Text style={styles.referenceValue}>{order.wompiReference}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Productos del pedido */}
        <View style={styles.productsCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(232, 234, 246, 0.8)']}
            style={styles.productsGradient}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="bag" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Productos</Text>
            </View>
            {order.products.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.productId?.images?.[0] }}
                    style={styles.productImage}
                    defaultSource={require('../../assets/Productos/peinetarosa.png')}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                </View>
                <View style={styles.productDetails}>
                  <View style={styles.productInfoRow}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {product.productId?.name || 'Producto'}
                      </Text>
                      {product.variant?.size && (
                        <View style={styles.variantContainer}>
                          <Ionicons name="resize" size={12} color="#f06292" />
                          <Text style={styles.productVariant}>Talla: {product.variant.size}</Text>
                        </View>
                      )}
                      <View style={styles.quantityContainer}>
                        <Ionicons name="cube" size={12} color="#f06292" />
                        <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Ionicons name="pricetag" size={12} color="#f06292" />
                        <Text style={styles.productPrice}>
                          ${((product.unitPriceCents || 0) / 100).toFixed(2)} c/u
                        </Text>
                      </View>
                    </View>
                    <View style={styles.subtotalContainer}>
                      <Text style={styles.productSubtotal}>
                        ${((product.subtotalCents || 0) / 100).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Informacion de envio */}
        {order.shippingAddress && (
          <View style={styles.shippingCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(232, 234, 246, 0.8)']}
              style={styles.shippingGradient}
            >
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>Información de Envío</Text>
              </View>
              <View style={styles.addressContainer}>
                <View style={styles.addressRow}>
                  <Ionicons name="person" size={16} color="#e91e63" />
                  <Text style={styles.addressText}>{order.shippingAddress.name}</Text>
                </View>
                <View style={styles.addressRow}>
                  <Ionicons name="call" size={16} color="#e91e63" />
                  <Text style={styles.addressText}>{order.shippingAddress.phone}</Text>
                </View>
                <View style={styles.addressRow}>
                  <Ionicons name="mail" size={16} color="#e91e63" />
                  <Text style={styles.addressText}>{order.shippingAddress.email}</Text>
                </View>
                <View style={styles.addressRow}>
                  <Ionicons name="location" size={16} color="#e91e63" />
                  <Text style={styles.addressText}>
                    {order.shippingAddress.line1}, {order.shippingAddress.city}
                  </Text>
                </View>
                {order.shippingAddress.zip && (
                  <View style={styles.addressRow}>
                    <Ionicons name="mail" size={16} color="#e91e63" />
                    <Text style={styles.addressText}>CP: {order.shippingAddress.zip}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Resumen de costos */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(232, 234, 246, 0.8)']}
            style={styles.summaryGradient}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="calculator" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Resumen</Text>
            </View>
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
              <View style={styles.totalLabelContainer}>
                <Ionicons name="diamond" size={18} color="#5c6bc0" />
                <Text style={styles.totalLabel}>Total:</Text>
              </View>
              <View style={styles.totalValueContainer}>
                <Text style={styles.totalValue}>
                  ${(order.total || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </LinearGradient>
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
  loadingContent: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderInfoCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  orderInfoGradient: {
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
    gap: 8,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  orderDate: {
    fontSize: 14,
    color: '#f06292',
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
  referenceContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '600',
  },
  referenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ad1457',
    fontFamily: 'monospace',
  },
  productsCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  productsGradient: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(121, 134, 203, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 15,
    borderRadius: 12,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9fa8da',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f3e5f5',
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
    fontWeight: 'bold',
    color: '#ad1457',
    marginBottom: 8,
  },
  variantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 12,
    color: '#f06292',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#f06292',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productPrice: {
    fontSize: 12,
    color: '#f06292',
    fontWeight: '500',
  },
  subtotalContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  productSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  shippingCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  shippingGradient: {
    padding: 20,
  },
  addressContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#ad1457',
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '600',
  },
  discountValue: {
    color: '#4caf50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(121, 134, 203, 0.3)',
    paddingTop: 15,
    marginTop: 12,
  },
  totalLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalValueContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default OrderDetailScreen;
