// src/components/Carrito/CartTotal/CartTotal.jsx
import React from 'react';
import './CartTotal.css';

const CartTotal = ({ total }) => {
  return (
    <div className="cart-total">
      <p>Total</p>
      <h2>${total.toFixed(2)}</h2>
    </div>
  );
};

export default CartTotal;
