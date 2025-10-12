import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import HistorialItem from '../components/Historial/HistorialItem'; 
import '../components/Historial/HistorialVenta.css'; 
import './Historial.css'; 
import { FiArrowLeft } from 'react-icons/fi'; // Icono de flecha para regresar

const API_BASE_URL = 'https://eternaljoyeria-cg5d.onrender.com/api';

// Función para obtener la dirección de envío priorizando la de la tabla Sales
const fetchAddressFromSales = async (orderId) => {
    try {
        // Asumiendo que existe un endpoint para buscar la Venta por el ID de la Orden
        const response = await fetch(`${API_BASE_URL}/sales/by-order/${orderId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const saleData = await response.json();
            // Retorna el campo 'address' que es el string de la tabla Sales
            if (saleData && saleData.address) {
                return saleData.address;
            }
        }
        return null;
    } catch (err) {
        console.warn("Error al obtener la dirección de la tabla 'Sales'.", err);
        return null;
    }
}

// Función auxiliar para formatear la dirección (si viene como objeto de la tabla Orders)
const formatAddressObject = (addressObj) => {
    if (!addressObj) return "Dirección no disponible.";
    
    const { line1, city, region, country, zip } = addressObj;
    return [line1, city, region, country, zip]
        .filter(part => part && part.trim() !== '')
        .join(', ');
};

const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    switch (status.toLowerCase()) {
        case 'entregado':
            return '#10b981';
        case 'en camino':
            return '#f59e0b';
        case 'pendiente':
        case 'no pagado':
            return '#ef4444';
        case 'pagado':
            return '#10b981';
        default:
            return '#6b7280';
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const DetallesOrdenPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [saleAddress, setSaleAddress] = useState(null); // Estado para la dirección de Sales
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // 1. Obtener los detalles de la ORDEN por su ID
                const orderResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                    credentials: 'include'
                }); 

                if (!orderResponse.ok) {
                    throw new Error(`Error ${orderResponse.status}: No se pudo cargar el detalle de la orden.`);
                }
                
                const orderData = await orderResponse.json();
                setOrder(orderData);

                // 2. Intentar obtener la dirección de la tabla Sales
                const addressFromSales = await fetchAddressFromSales(orderId);
                setSaleAddress(addressFromSales);

                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (isLoading) {
        return (
            <>
                <Nav />
                <div className="historial-page">
                    <div className="orders-container">
                        <div className="empty-state">
                            <h3>Cargando detalles de la orden...</h3>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Nav />
                <div className="historial-page">
                    <div className="orders-container">
                        <div className="empty-state">
                            <div className="empty-icon">❌</div>
                            <h3>{error || "Orden no encontrada"}</h3>
                            <p>El detalle de la orden con ID: {orderId} no pudo ser cargado.</p>
                            <Link to="/historial" className="filter-btn active" style={{ marginTop: '1rem' }}>
                                <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Volver al historial
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const productsToDisplay = order.products.map((productItem, index) => ({
        key: `${order._id}-${productItem.productId._id}-${index}`,
        name: productItem.productId.name,
        price: productItem.productId.price, 
        image: productItem.productId.images?.[0] || 'https://placehold.co/150x150',
        quantity: productItem.quantity,
        subtotal: productItem.subtotal, 
    }));

    // Priorizar la dirección de la tabla Sales (string)
    const finalAddress = saleAddress || formatAddressObject(order.shippingAddress);

    return (
        <>
            <Nav />
            <div className="historial-page">
                <div className="historial-hero">
                    <div className="historial-hero-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Link to="/historial" className="back-link">
                             <FiArrowLeft size={18} style={{ marginRight: '8px' }} /> 
                            Volver al Historial de Compras
                        </Link>
                        <h1 className="historial-title" style={{ fontSize: '2rem' }}>Detalles de la Orden #{orderId.slice(-8)}</h1>
                        <p className="historial-subtitle">Información detallada sobre tu pedido.</p>
                    </div>
                </div>
                
                <div className="historial-orders">
                    <div className="orders-container">
                        
                        <div className="historial-venta" style={{ padding: '2rem' }}>
                            <div className="venta-header">
                                <div className="venta-info">
                                    <span className="info-label">Fecha de Compra</span>
                                    <span className="info-value">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="venta-info">
                                    <span className="info-label">Estado de la Orden</span>
                                    <span 
                                        className="status-text"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {order.status || 'Sin estado'}
                                    </span>
                                </div>
                                <div className="venta-total">
                                    <span className="total-label">Total Pagado</span>
                                    <span className="total-amount">${order.total?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                            
                            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e0d8d8' }}/>

                            <h3 style={{ color: '#4b1717', margin: '0 0 1rem 0', fontWeight: '600' }}>Dirección de Envío</h3>
                            <p style={{ color: '#6d4b4b', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                                {finalAddress}
                            </p>
                            {order.shippingAddress && order.shippingAddress.name && (
                                <p style={{ color: '#6d4b4b', margin: '0' }}>
                                    **Contacto:** {order.shippingAddress.name} ({order.shippingAddress.email}) | Tel: {order.shippingAddress.phone}
                                </p>
                            )}
                            
                            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e0d8d8' }}/>

                            <h3 style={{ color: '#4b1717', margin: '0 0 1rem 0', fontWeight: '600' }}>Productos</h3>
                            <div className="venta-productos" style={{ padding: '0' }}>
                                {productsToDisplay.map(product => (
                                    <HistorialItem key={product.key} product={product} />
                                ))}
                            </div>
                            
                            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e0d8d8' }}/>

                            <div className="venta-total" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem', padding: '0 0.5rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="info-label">Costo de Envío</span>
                                    <span className="info-value">${(order.shippingCents / 100)?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="info-label">Total Final</span>
                                    <span className="total-amount">${order.total?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DetallesOrdenPage;