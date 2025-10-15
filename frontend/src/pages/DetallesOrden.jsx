import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import SidebarCart from '../components/Cart/SidebarCart';
import './OrderDetailPage.css';

const BACKEND_URL = 'https://eternaljoyeria-cg5d.onrender.com';
const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  PRODUCTS: '/api/products',
};

// Función para construir URL completa
const buildApiUrl = (endpoint = '') => `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

// Función para generar URL de imagen con snapshot
const getProductImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/80x80/f0f0f0/333?text=N/A';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status) => {
    const lowerStatus = status?.toLowerCase() || 'desconocido';
    let color = '#9E9E9E';
    let text = status || 'Desconocido';
    switch (lowerStatus) {
      case 'pagado':
        color = '#28a745'; text = 'Pagado'; break;
      case 'pending_payment':
        color = '#ffc107'; text = 'Pendiente de Pago'; break;
      case 'no pagado':
        color = '#dc3545'; text = 'No Pagado'; break;
      case 'enviado':
      case 'en camino':
        color = '#007bff'; text = 'En Camino'; break;
      case 'entregado':
        color = '#17a2b8'; text = 'Entregado'; break;
      default:
        color = '#6c757d'; text = status; break;
    }
    return { color, text };
  };

  const formatPrice = (cents) => {
    if (cents == null || isNaN(cents)) return 'N/A';
    return `$${(cents / 100).toFixed(2)}`;
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        setError('ID de pedido no encontrado.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const orderUrl = buildApiUrl(API_ENDPOINTS.ORDERS) + `/${orderId}`;
        const response = await fetch(orderUrl, { credentials: 'include' });
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo cargar el pedido.`);
        let data = await response.json();

        // Snapshot de productos
        if (data.products && data.products.length > 0) {
          data.products = data.products.map((item) => {
            const product = item.productId || {};
            return {
              ...item,
              productId: product,
              productName: item.productName || product.name || 'Producto eliminado',
              productImage: item.productImage || (product.images?.[0] || 'https://placehold.co/80x80/f0f0f0/333?text=N/A'),
              unitPriceCents: item.unitPriceCents || item.subtotalCents / (item.quantity || 1) || 0,
            };
          });
        }
        setOrder(data);
      } catch (err) {
        console.error('Error cargando detalle del pedido:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) return (
    <>
      <Nav cartOpen={cartOpen} />
      <div className="order-detail-page loading">
        <h1 className="main-title">Cargando Pedido...</h1>
        <div className="loading-spinner"></div>
      </div>
      <Footer />
    </>
  );

  if (error || !order) return (
    <>
      <Nav cartOpen={cartOpen} />
      <div className="order-detail-page error">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Volver al historial
        </button>
        <div className="error-box">
          <span className="error-icon">❌</span>
          <h2>No se pudo encontrar el pedido.</h2>
          <p>{error || "El ID del pedido no es válido o no existe."}</p>
        </div>
      </div>
      <Footer />
    </>
  );

  const statusInfo = getStatusInfo(order.status);
  const productsList = order.products || [];

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      <div className="order-detail-page">
        <div className="order-header-wrapper">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Volver al historial
          </button>
          <div className="order-title-section">
            <h1>Detalle del Pedido #{order._id.slice(-6).toUpperCase()}</h1>
            <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
              {statusInfo.text}
            </span>
          </div>
          <p className="order-date-time">Realizado el: {formatDate(order.createdAt)}</p>
        </div>

        <div className="order-content">
          <div className="products-section card-box">
            <h2 className="section-title"><FiPackage /> Productos ({productsList.length})</h2>
            <div className="product-list">
              {productsList.map((item, idx) => (
                <div key={idx} className="product-item">
                  <div className="product-image-container">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="product-img"
                    />
                  </div>
                  <div className="product-info-details">
                    <span className="product-name">{item.productName}</span>
                    <span className="product-quantity">Cantidad: {item.quantity}</span>
                    <span className="product-price">{formatPrice(item.unitPriceCents)} c/u</span>
                  </div>
                  <div className="product-subtotal">
                    <span className="subtotal-label">Subtotal:</span>
                    <span className="subtotal-value">{formatPrice(item.subtotalCents)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.shippingAddress && (
            <div className="shipping-section card-box">
              <h2 className="section-title"><FiMapPin /> Dirección de Envío</h2>
              <div className="address-details">
                <p><strong>{order.shippingAddress.name}</strong> ({order.shippingAddress.phone})</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country} - {order.shippingAddress.zip}</p>
              </div>
            </div>
          )}

          {order.paymentMethod && (
            <div className="payment-section card-box">
              <h2 className="section-title"><FiCreditCard /> Método de Pago</h2>
              <p>{order.paymentMethod}</p>
            </div>
          )}

          <div className="order-total-section card-box">
            <h2>Total Pagado</h2>
            <p className="order-total-amount">{formatPrice(order.totalCents)}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
