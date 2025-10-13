import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import HistorialItem from '../components/Historial/HistorialItem';
import SidebarCart from '../components/Cart/SidebarCart';
import './Historial.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../components/Historial/HistorialVenta.css';
import { FiEye } from 'react-icons/fi';

// ------------------------------------------------------------------
// CONFIGURACIÓN DE LA API
// ------------------------------------------------------------------
const BACKEND_URL = 'https://eternaljoyeria-cg5d.onrender.com';
const API_BASE_URL = `${BACKEND_URL}/api`;

// Construcción segura de la URL de la imagen
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/150x150';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
// ------------------------------------------------------------------

const HistorialPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Funciones de formato
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    switch (status.toLowerCase()) {
      case 'entregado':
      case 'pagado':
        return '#10b981'; // Verde
      case 'en camino':
        return '#f59e0b'; // Naranja
      case 'pendiente':
      case 'no pagado':
        return '#ef4444'; // Rojo
      default:
        return '#6b7280'; // Gris
    }
  };

  useEffect(() => {
    const userId = user?._id || user?.id;

    const fetchSales = async () => {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setIsLoading(false);
        setSales([]);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/sales/by-customer/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el historial de ventas`);
        }

        const data = await response.json();
        setSales(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error('Error al obtener las ventas:', err);
      }
    };

    if (!authLoading && userId) {
      fetchSales();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Función para ver detalles
  const handleViewDetails = (orderId) => {
    navigate(`/historial/detalles/${orderId}`);
  };

  // Filtrado y agrupación
  const filteredSales =
    selectedFilter === 'todos'
      ? sales
      : sales.filter((sale) =>
          sale.idOrder?.status?.toLowerCase()?.includes(selectedFilter.toLowerCase())
        );

  const totalOrders = filteredSales.length;
  const totalSpent = filteredSales.reduce(
    (total, sale) => total + (sale.idOrder?.total || 0),
    0
  );

  const groupedOrders = filteredSales.reduce((acc, sale) => {
    const order = sale.idOrder;

    if (!order || acc[order._id]) return acc;

    acc[order._id] = {
      date: order.createdAt,
      status: order.status,
      orderNumber: order._id,
      orderTotal: (order.totalCents / 100) || order.total || 0,
      saleAddress: sale.address,
      products: order.products.map((productItem, index) => {
        const subtotal =
          (productItem.subtotalCents / 100) || productItem.subtotal || 0;
        const quantity = productItem.quantity || 1;
        const unitPrice = subtotal / quantity;

        return {
          key: `${order._id}-${productItem.productId?._id || index}`,
          name: productItem.productId?.name || 'Producto eliminado',
          image: getImageUrl(productItem.productId?.images?.[0]),
          quantity,
          subtotal,
          price: unitPrice, // 👈 se pasa precio unitario
        };
      }),
    };

    return acc;
  }, {});

  const ordersToDisplay = Object.values(groupedOrders);

  if (isLoading || authLoading) {
    return (
      <div className="historial-page">
        <div className="orders-container">
          <div className="empty-state">
            <h2>Cargando historial de compras...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        <div className="historial-page">
          <div className="orders-container">
            <div className="empty-state">
              <div className="empty-icon">{error ? '❌' : '🔒'}</div>
              <h3>{error ? 'Error de Conexión' : 'Acceso Restringido'}</h3>
              <p>
                {error
                  ? `Hubo un problema: ${error}`
                  : 'Por favor, inicia sesión para ver tu historial de compras.'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />

      <div className="historial-page">
        <div className="historial-hero">
          <div className="historial-hero-content">
            <div className="historial-hero-text">
              <h1 className="historial-title">Tu Historial de Compras</h1>
              <p className="historial-subtitle">
                Revive tus momentos especiales con nuestras joyas únicas
              </p>
            </div>
            <div className="historial-stats">
              <div className="stat-card">
                <div className="stat-number">{totalOrders}</div>
                <div className="stat-label">Pedidos Realizados</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">${totalSpent.toFixed(2)}</div>
                <div className="stat-label">Total Invertido</div>
              </div>
            </div>
          </div>
        </div>

        <div className="historial-filters">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                selectedFilter === 'todos' ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter('todos')}
            >
              Todos los pedidos
            </button>
            <button
              className={`filter-btn ${
                selectedFilter === 'entregado' ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter('entregado')}
            >
              Entregados
            </button>
            <button
              className={`filter-btn ${
                selectedFilter === 'camino' ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter('camino')}
            >
              En camino
            </button>
            <button
              className={`filter-btn ${
                selectedFilter === 'no pagado' ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter('no pagado')}
            >
              No pagados
            </button>
          </div>
        </div>

        <div className="historial-orders">
          <div className="orders-container">
            {ordersToDisplay.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No hay pedidos que coincidan</h3>
                <p>
                  Revisa el filtro seleccionado o realiza tu primera compra.
                </p>
              </div>
            ) : (
              ordersToDisplay.map((order, index) => (
                <div key={order.orderNumber} className="historial-venta">
                  <div className="venta-header">
                    <div className="venta-info">
                      <span className="info-label">ID de Orden</span>
                      <span className="info-value">
                        #{order.orderNumber.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="venta-info">
                      <span className="info-label">Fecha</span>
                      <span className="info-value">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div className="venta-total">
                      <span className="total-label">Total pagado</span>
                      <span className="total-amount">
                        ${order.orderTotal?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="status-container">
                      <span
                        className="status-text"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {order.status || 'Sin estado'}
                      </span>
                    </div>

                    <button
                      className="details-eye-btn"
                      onClick={() =>
                        handleViewDetails(order.orderNumber)
                      }
                      title={`Ver detalles del pedido ${index + 1}`}
                    >
                      <FiEye size={20} />
                    </button>
                  </div>

                  <div className="venta-productos">
                    {order.products.map((product) => (
                      <HistorialItem
                        key={product.key}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HistorialPage;
