import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import HistorialItem from '../components/Historial/HistorialItem';
import SidebarCart from '../components/Cart/SidebarCart';
import './Historial.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../components/Historial/HistorialVenta.css'; 

const API_BASE_URL = 'https://eternaljoyeria-cg5d.onrender.com/api'; // Definir la URL base

const HistorialPage = () => {
  const { user, loading: authLoading } = useAuth();
  
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Funciones para formatear la fecha y el estado
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#10b981';
      case 'en camino':
        return '#f59e0b';
      case 'pendiente':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    const userId = user?._id || user?.id; // Usamos _id o id

    const fetchSales = async () => {
      setIsLoading(true);
      setError(null);

      if (!userId) { // Chequeamos por el ID del usuario
        setIsLoading(false);
        setSales([]);
        return;
      }

      try {
        console.log("Fetching sales for user ID:", userId);
        
        const response = await fetch(`${API_BASE_URL}/sales/by-customer/${userId}`, {
          credentials: 'include' // Esto es crucial para la autenticación basada en cookies
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el historial de ventas`);
        }
        
        const data = await response.json();
        // Aseguramos que la data es un array o usamos un array vacío si no lo es
        setSales(Array.isArray(data) ? data : []); 
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error("Error al obtener las ventas:", err);
      }
    };

    // Solo llamamos a fetchSales si no está cargando la autenticación Y tenemos un userId
    if (!authLoading && userId) {
      fetchSales();
    } else if (!authLoading) {
      // Si authLoading terminó y no tenemos ID, finaliza la carga
      setIsLoading(false);
    }
    
  }, [user, authLoading]); // user como dependencia es suficiente

  const filteredSales = selectedFilter === 'todos' 
    ? sales 
    : sales.filter(sale => sale.idOrder?.status?.toLowerCase()?.includes(selectedFilter.toLowerCase()));
  
  const totalOrders = filteredSales.length;
  const totalSpent = filteredSales.reduce((total, sale) => total + (sale.idOrder?.total || 0), 0);

  if (isLoading || authLoading) {
    return (
      <div className="historial-page">
        <h2>Cargando historial de compras...</h2>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="historial-page">
        <h2>Error: {error}</h2>
        <p>No se pudo cargar tu historial. Intenta de nuevo más tarde.</p>
        <p>Asegúrate de que el endpoint ${API_BASE_URL}/sales/by-customer/ esté funcionando correctamente.</p>
      </div>
    );
  }

  // Si no hay usuario y ya terminó de cargar
  if (!user && !authLoading) {
      return (
          <>
            <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <Nav cartOpen={cartOpen} />
            <div className="historial-page">
              <div className="empty-state">
                <div className="empty-icon">🔒</div>
                <h3>Acceso Restringido</h3>
                <p>Por favor, inicia sesión para ver tu historial de compras.</p>
              </div>
            </div>
            <Footer />
          </>
      );
  }

  // Lógica para crear un array plano de todos los productos, manteniendo la información de la venta
  const allProducts = filteredSales.flatMap(sale => 
    sale.idOrder?.products?.map((productItem, index) => {
      // Validación extra: si no hay productId, saltar este elemento
      if (!productItem?.productId) {
        console.warn('Producto sin ID encontrado en la venta:', sale._id);
        return null; 
      }
      return {
        key: `${sale._id}-${productItem.productId._id}-${index}`,
        name: productItem.productId.name,
        price: productItem.productId.price,
        // Usamos productItem.productId.images que es la referencia al producto
        image: productItem.productId.images?.[0] || 'https://placehold.co/150x150',
        quantity: productItem.quantity,
        subtotal: productItem.subtotal,
        date: sale.idOrder.createdAt,
        status: sale.idOrder.status,
        orderNumber: sale.idOrder._id,
        orderTotal: sale.idOrder.total,
      };
    }).filter(product => product !== null) || []
  );

  // Lógica para agrupar los productos por número de orden
  const groupedOrders = allProducts.reduce((acc, product) => {
    const orderId = product.orderNumber;
    if (!acc[orderId]) {
      acc[orderId] = {
        // Copiamos las propiedades de la orden desde el primer producto
        date: product.date,
        status: product.status,
        orderNumber: product.orderNumber,
        orderTotal: product.orderTotal,
        products: [],
      };
    }
    acc[orderId].products.push(product);
    return acc;
  }, {});

  // Convertimos el objeto agrupado a un array para poder mapearlo
  const ordersToDisplay = Object.values(groupedOrders);
  
  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      
      <div className="historial-page">
        <div className="historial-hero">
          <div className="historial-hero-content">
            <div className="historial-hero-text">
              <h1 className="historial-title">Tu Historial de Compras</h1>
              <p className="historial-subtitle">Revive tus momentos especiales con nuestras joyas únicas</p>
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
              className={`filter-btn ${selectedFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('todos')}
            >
              Todos los pedidos
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'entregado' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('entregado')}
            >
              Entregados
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'camino' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('camino')}
            >
              En camino
            </button>
          </div>
        </div>

        <div className="historial-orders">
          <div className="orders-container">
            {ordersToDisplay.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No hay pedidos para mostrar</h3>
                <p>Cuando realices tu primera compra, aparecerá aquí</p>
              </div>
            ) : (
              ordersToDisplay.map((order, index) => (
                <div key={order.orderNumber} className="historial-venta">
                  <div className="venta-header">
                    <div className="venta-info">
                      <span className="info-label">Pedido No.</span>
                      <span className="info-value">{index + 1}</span> 
                    </div>
                    <div className="venta-info">
                      <span className="info-label">Fecha</span>
                      <span className="info-value">{formatDate(order.date)}</span>
                    </div>
                    <div className="venta-total">
                      <span className="total-label">Total pagado</span>
                      <span className="total-amount">${order.orderTotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="status-container">
                      <span 
                        className="status-text"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {order.status || 'Sin estado'}
                      </span>
                    </div>
                  </div>
                  <div className="venta-productos">
                    {order.products.map(product => (
                      <HistorialItem key={product.key} product={product} />
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
