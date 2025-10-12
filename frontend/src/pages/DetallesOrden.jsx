import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import Nav from '../components/Nav/Nav'; // Ajusta la ruta si es necesario
import Footer from '../components/Footer'; // Ajusta la ruta si es necesario
import SidebarCart from '../components/Cart/SidebarCart'; // Si lo usas en todas las páginas
import './OrderDetailPage.css'; // 🚨 Debes crear este archivo CSS

// ------------------------------------------------------------------
// CONFIGURACIÓN DE LA API (Consolidado)
// ------------------------------------------------------------------
const BACKEND_URL = 'https://eternaljoyeria-cg5d.onrender.com';
const API_ENDPOINTS = {
    ORDERS: '/api/orders',
    PRODUCTS: '/api/products',
};

// Función para construir URL completa
const buildApiUrl = (endpoint = '') =>
    `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

// Función para generar la URL completa de una imagen
const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
// ------------------------------------------------------------------

const OrderDetailPage = () => {
    // Captura el ID de la orden de la URL
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartOpen, setCartOpen] = useState(false); // Para el SidebarCart

    // #region Funciones de Formateo

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
        let color = '#9E9E9E'; // Gris
        let text = status || 'Desconocido';

        switch (lowerStatus) {
            case 'pagado':
                color = '#28a745'; // Verde
                text = 'Pagado';
                break;
            case 'pending_payment':
                color = '#ffc107'; // Amarillo
                text = 'Pendiente de Pago';
                break;
            case 'no pagado':
                color = '#dc3545'; // Rojo
                text = 'No Pagado';
                break;
            case 'enviado':
            case 'en camino':
                color = '#007bff'; // Azul
                text = 'En Camino';
                break;
            case 'entregado':
                color = '#17a2b8'; // Azul claro
                text = 'Entregado';
                break;
            default:
                color = '#6c757d'; // Gris oscuro
                text = status;
                break;
        }
        return { color, text };
    };

    // Formateo de precios (asumiendo que el API devuelve en centavos para los totales)
    const formatPrice = (cents) => {
        if (cents == null || isNaN(cents)) return 'N/A';
        return `$${(cents / 100).toFixed(2)}`;
    };

    // #endregion

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) {
                setLoading(false);
                setError('ID de pedido no encontrado.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // El token debe obtenerse de donde lo guardes (ej: localStorage)
                const token = localStorage.getItem('authToken');

                // 1. Obtener los detalles de la Orden
                const orderUrl = buildApiUrl(API_ENDPOINTS.ORDERS) + `/${orderId}`;
                const orderResponse = await fetch(orderUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!orderResponse.ok) {
                    throw new Error(`Error ${orderResponse.status}: No se pudo cargar el detalle del pedido.`);
                }

                let data = await orderResponse.json();

                // 2. Obtener datos completos de cada producto si la información no está populada
                if (data.products && data.products.length > 0) {
                    const productsWithDetails = await Promise.all(
                        data.products.map(async (product) => {
                            // Si productId ya es un objeto (populado), úsalo
                            const isPopulated = typeof product.productId === 'object' && product.productId !== null;
                            const productId = isPopulated ? product.productId._id : product.productId;

                            if (productId && !isPopulated) {
                                try {
                                    const productResponse = await fetch(buildApiUrl(API_ENDPOINTS.PRODUCTS) + `/${productId}`, {
                                        method: 'GET',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });

                                    if (productResponse.ok) {
                                        const fullProduct = await productResponse.json();
                                        const actualProductData = fullProduct.product || fullProduct;
                                        
                                        return {
                                            ...product,
                                            productId: actualProductData, // Reemplazar ID simple por objeto completo
                                        };
                                    }
                                } catch (productError) {
                                    console.error('Error fetching individual product:', productError);
                                }
                            }
                            return product; // Devolver el producto original si no se pudo obtener o ya estaba completo
                        })
                    );
                    data = { ...data, products: productsWithDetails };
                }

                setOrder(data);

            } catch (err) {
                console.error('Error al cargar detalle del pedido:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    // #region Contenido JSX (Renderizado)

    if (loading) {
        return (
            <>
                <Nav cartOpen={cartOpen} />
                <div className="order-detail-page loading">
                    <h1 className="main-title">Cargando Pedido...</h1>
                    <div className="loading-spinner"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
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
    }

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
                        <span 
                            className="status-badge" 
                            style={{ backgroundColor: statusInfo.color }}
                        >
                            {statusInfo.text}
                        </span>
                    </div>

                    <p className="order-date-time">
                        Realizado el: {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="order-content">
                    {/* Sección de Productos */}
                    <div className="products-section card-box">
                        <h2 className="section-title"><FiPackage /> Productos ({productsList.length})</h2>
                        <div className="product-list">
                            {productsList.map((productItem, index) => {
                                const fullProduct = productItem.productId;
                                const imageUrl = getProductImageUrl(fullProduct?.images?.[0]);
                                
                                return (
                                    <div key={index} className="product-item">
                                        <div className="product-image-container">
                                            <img 
                                                src={imageUrl || 'https://placehold.co/80x80/f0f0f0/333?text=N/A'} 
                                                alt={fullProduct?.name || 'Producto'}
                                                className="product-img"
                                            />
                                        </div>
                                        <div className="product-info-details">
                                            <span className="product-name">{fullProduct?.name || 'Producto Desconocido'}</span>
                                            <span className="product-quantity">
                                                Cantidad: **{productItem.quantity}**
                                            </span>
                                            <span className="product-price">
                                                {formatPrice(productItem.unitPriceCents)} c/u
                                            </span>
                                        </div>
                                        <div className="product-subtotal">
                                            <span className="subtotal-label">Subtotal:</span>
                                            <span className="subtotal-value">
                                                {formatPrice(productItem.subtotalCents)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección de Dirección de Envío */}
                    {order.shippingAddress && (
                        <div className="shipping-section card-box">
                            <h2 className="section-title"><FiMapPin /> Dirección de Envío</h2>
                            <div className="address-details">
                                <p><strong>{order.shippingAddress.name}</strong> ({order.shippingAddress.phone})</p>
                                <p>{order.shippingAddress.line1} {order.shippingAddress.line2}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                                <p>CP: {order.shippingAddress.zip}</p>
                                <p>Email: {order.shippingAddress.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Resumen de Costos */}
                    <div className="summary-section card-box">
                        <h2 className="section-title"><FiCreditCard /> Resumen de Pagos</h2>
                        <div className="summary-row">
                            <span>Subtotal Productos:</span>
                            <span>{formatPrice((order.totalCents || 0) - (order.shippingCents || 0) - (order.taxCents || 0) + (order.discountCents || 0))}</span>
                        </div>
                        {order.shippingCents > 0 && (
                            <div className="summary-row">
                                <span>Costo de Envío:</span>
                                <span>{formatPrice(order.shippingCents)}</span>
                            </div>
                        )}
                        {order.taxCents > 0 && (
                            <div className="summary-row">
                                <span>Impuestos (IVA):</span>
                                <span>{formatPrice(order.taxCents)}</span>
                            </div>
                        )}
                        {order.discountCents > 0 && (
                            <div className="summary-row discount-row">
                                <span>Descuento Aplicado:</span>
                                <span>-{formatPrice(order.discountCents)}</span>
                            </div>
                        )}
                        <div className="summary-row total-row">
                            <span>Total Pagado:</span>
                            <span className="total-amount">{formatPrice(order.totalCents)}</span>
                        </div>
                        {order.wompiReference && (
                            <p className="payment-ref">
                                **Referencia Wompi:** {order.wompiReference}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderDetailPage;