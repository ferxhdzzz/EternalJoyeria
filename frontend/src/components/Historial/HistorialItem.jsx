import React from 'react';
import './HistorialItem.css';

const HistorialItem = ({ product }) => {
  return (
    <div className="historial-item">
      <img src={product.image} alt={product.name} className="historial-item-image" />
      <div className="historial-item-details">
        <p className="historial-item-name">{product.name}</p>
        <p className="historial-item-quantity">Cantidad: {product.quantity}</p>
      </div>
      <p className="historial-item-price">${(product.price * product.quantity).toFixed(2)}</p>
    </div>
  );
};

export default HistorialItem;
