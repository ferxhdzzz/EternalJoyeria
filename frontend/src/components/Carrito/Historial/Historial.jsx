// src/components/CartItem/CartItem.jsx
import React from 'react';
import './Historial.css';

const CartItem = ({ product, onUpdateQuantity }) => {
  

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />
      <div className="cart-item-details">
        <h4>{product.name}</h4>
    
        <p className="price">${product.price}</p>
      </div>
     
    </div>
  );
};

export default CartItem;
