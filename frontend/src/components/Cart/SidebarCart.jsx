import React, { useState } from 'react';
import './SidebarCart.css';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const SidebarCart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calcular subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Animación: clase para mostrar/ocultar
  const sidebarClass = isOpen ? 'sidebar-cart open' : 'sidebar-cart';

  return (
    <div className={sidebarClass}>
      <div className="sidebar-cart__header">
        <span className="sidebar-cart__title">CARRITO</span>
        <button className="sidebar-cart__close" onClick={onClose}>&times;</button>
      </div>
      <div className="sidebar-cart__content">
        {cartItems.length === 0 ? (
          <div className="sidebar-cart__empty">
            <p>Tu carrito está vacío.<br/>¡Agrega algo bonito!</p>
          </div>
        ) : (
          <ul className="sidebar-cart__list">
            {cartItems.map((item, idx) => (
              <li key={item.id + '-' + idx} className="sidebar-cart__item">
                <img src={item.image} alt={item.name} className="sidebar-cart__img" />
                <div className="sidebar-cart__info">
                  <span className="sidebar-cart__name">{item.name}</span>
                  <span className="sidebar-cart__price">{item.quantity} × ${item.price.toFixed(2)}</span>
                </div>
                <button className="sidebar-cart__remove" onClick={() => removeFromCart(item.id, item.size)}>&times;</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="sidebar-cart__footer">
        <div className="sidebar-cart__subtotal">
          <span>SUBTOTAL:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button
          className="sidebar-cart__btn sidebar-cart__btn--view"
          onClick={() => { onClose(); navigate('/cart'); }}
          disabled={cartItems.length === 0}
        >
          VER CARRITO
        </button>
        <button
          className="sidebar-cart__btn sidebar-cart__btn--checkout"
          onClick={() => { onClose(); navigate('/checkout'); }}
          disabled={cartItems.length === 0}
        >
          PAGAR
        </button>
      </div>
    </div>
  );
};

export default SidebarCart; 