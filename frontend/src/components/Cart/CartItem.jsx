import React from 'react';
import './CartItem.css';
import { Plus, Minus } from 'lucide-react';

const CartItem = ({ product, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (delta) => {
    const newQty = product.quantity + delta;
    onUpdateQuantity(product.id, product.size, newQty);
  };

  const handleRemove = () => {
    onRemove(product.id, product.size);
  };

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div className="cart-item-header">
          <p className="cart-item-name">{product.name}</p>
          <p className="cart-item-price">${(product.price * product.quantity).toFixed(2)}</p>
        </div>
        <p className="cart-item-style">Talla: {product.size}</p>
        <div className="cart-item-actions">
          <div className="cart-item-quantity">
            <button onClick={() => handleQuantityChange(-1)} className="quantity-btn">
              <span className="quantity-symbol">-</span>
            </button>
            <span>{product.quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="quantity-btn">
              <span className="quantity-symbol">+</span>
            </button>
          </div>
          <button onClick={handleRemove} className="remove-button">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
