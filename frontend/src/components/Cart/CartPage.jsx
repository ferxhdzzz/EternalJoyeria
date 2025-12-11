import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import SidebarCart from './SidebarCart';
import './CartPage.css';

const MinusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b94a6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b94a6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e75480" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);



const CartPage = () => {
    // Utilizamos cartData, isLoading y error del contexto
    const { 
        cartItems, 
        cartData, 
        isLoading, 
        error, 
        updateQuantity, 
        removeFromCart 
    } = useCart();
    const navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(false);

    // =================================================
    // CÁLCULO DE TOTALES (Usando datos verificados del backend)
    // =================================================
    const totalCents = cartData?.totalCents || 0;
    const shippingCents = cartData?.shippingCents || 0;

    const total = totalCents / 100;
    const shipping = shippingCents / 100;
    
    // Subtotal: Total - Envío - Impuestos + Descuentos (Si tienes)
    const subtotalCents = totalCents - shippingCents - (cartData?.taxCents || 0) + (cartData?.discountCents || 0);
    const subtotal = subtotalCents / 100;

    // =================================================
    // VISTAS DE ESTADO
    // =================================================

    if (isLoading) {
        return (
            <div className="cartpage-bg">
                <Nav />
                <h1 className="cartpage-title">Cargando carrito...</h1>
                <p>Por favor, espere mientras sincronizamos sus productos.</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="cartpage-bg">
                <Nav />
                <h1 className="cartpage-title" style={{color: 'red'}}>Error al cargar el carrito</h1>
                <p>{error}</p>
                <p>Asegúrese de haber iniciado sesión correctamente.</p>
            </div>
        );
    }

    // Vista para el carrito vacío (Ahora se ejecuta solo si no hay carga ni error)
    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-page">
                <Nav />
                <div className="empty-cart-container">
                    <div className="empty-cart-text">
                        <h1>¡Aún no hay<br />brillo en<br />tu carrito!</h1>
                        <p>Descubre las piezas que harán eterno cada momento.</p>
                        <Link to="/productos" className="empty-cart-button">
                            Ver colección
                        </Link>
                    </div>
                    <div className="empty-cart-image">
                        <img src="/Carrito/CarritoVacioCorrecto.png" alt="Carrito vacío" />
                    </div>
                </div>
            </div>
        );
    }
    
    // =================================================
    // VISTA PRINCIPAL DEL CARRITO
    // =================================================

    return (
        <>
            <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <Nav cartOpen={cartOpen} />
            <div className="cartpage-bg">
                <div className="cartpage-flex">
                    {/* Columna izquierda: tabla de productos */}
                    <section className="cartpage-table-box">
                        <h2 className="cartpage-title">Carrito de compras</h2>
                        <table className="cartpage-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={`${item.id}-${item.size}`}> 
                                        <td className="cartpage-product-cell">
                                            <img src={item.image} alt={item.name} className="cartpage-product-img" />
                                            <div className="cartpage-product-info">
                                                <span className="cartpage-product-name">{item.name}</span>
                                            {/* Si manejas tamaños/variantes, muéstralo aquí */}
                                            {item.size && <span className="cartpage-product-size">Talla: {item.size}</span>}
                                            </div>
                                        </td>
                                        <td className="cartpage-grey-text">${item.price.toFixed(2)}</td>
                                        <td>
                                            <div className="cartpage-qty-box">
                                                {/* Botón de Restar */}
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} 
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <MinusIcon />
                                                </button>

                                                <span className="cartpage-grey-text">{item.quantity}</span>

                                                {/* Botón de Sumar con validación de stock */}
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                    // Deshabilita si la cantidad actual es igual o mayor al stock disponible
                                                    disabled={item.quantity >= item.stock} 
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="cartpage-grey-text">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="cartpage-remove-btn" onClick={() => removeFromCart(item.id, item.size)}><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Mensaje de stock máximo (opcional) */}
                        {cartItems.some(item => item.quantity >= item.stock) && (
                            <p className="cartpage-stock-alert">⚠️ Has alcanzado el límite de stock disponible para algunos productos.</p>
                        )}
                    </section>

                    {/* Columna derecha: resumen */}
                    <section className="cartpage-summary-box">
                        <h3 className="cartpage-summary-title">Resumen del pedido</h3>
                        <div className="cartpage-summary-row">
                            <span className="cartpage-grey-text">Subtotal</span>
                            <span className="cartpage-grey-text">${subtotal.toFixed(2)}</span> {/* USANDO SUBTOTA DEL BACKEND */}
                        </div>
                        <div className="cartpage-summary-row">
                             <span className="cartpage-grey-text">Envío</span>
                            <span className="cartpage-grey-text">${shipping.toFixed(2)}</span> {/* USANDO ENVÍO DEL BACKEND */}
                        </div>
                        <div className="cartpage-summary-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span> {/* USANDO TOTAL DEL BACKEND */}
                        </div>
                        <button className="cartpage-checkout-btn" onClick={() => navigate('/checkout')}>Proceder al pago</button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default CartPage;