// src/components/CartItem/CartItem.jsx
import React from 'react';
import './CartItem.css';

const CartItem = ({ product, onUpdateQuantity }) => {
  const handleQuantityChange = (delta) => {
    const newQty = product.quantity + delta;
    if (newQty >= 0) {
      onUpdateQuantity(product.id, newQty);
    }
  };

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />
      <div className="cart-item-details">
        <h4>{product.name}</h4>
    
        <p className="price">${product.price}</p>
      </div>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(-1)}>-</button>
        <span>{product.quantity}</span>
        <button onClick={() => handleQuantityChange(1)}>+</button>
      </div>
    </div>
  );
};

export default CartItem;
