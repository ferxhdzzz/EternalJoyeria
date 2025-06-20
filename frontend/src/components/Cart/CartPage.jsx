import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import CartItem from './CartItem';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Vista para el carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <Nav />
        <div className="empty-cart-container">
          <div className="empty-cart-text">
            <h1>¡Aún no hay brillo<br />en tu carrito!</h1>
            <p>Descubre las piezas que harán eterno cada momento.</p>
            <Link to="/products" className="empty-cart-button">
              Ver colección
            </Link>
          </div>
          <div className="empty-cart-image">
            <img src="/Cart.png" alt="Carrito vacío" />
          </div>
        </div>
      </div>
    );
  }

  // Vista para el carrito lleno
  return (
    <>
      <Nav />
      <div className="cart-page">
        <div className="cart-page-container">
          {/* Columna Izquierda: Items del Carrito */}
          <div className="cart-items-section">
            <h2>Carrito de compras</h2>
            <div className="cart-items-list">
              {cartItems.map(item => (
                <CartItem 
                  key={`${item.id}-${item.size}`}
                  product={item} 
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="cart-summary-section">
            <h3>Resumen del pedido</h3>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="buy-button" onClick={() => navigate('/checkout')}>Finalizar Compra</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
