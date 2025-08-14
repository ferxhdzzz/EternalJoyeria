import React from 'react';
import './HistorialItem.css';

const HistorialItem = ({ product }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#10b981';
      case 'en camino':
        return '#f59e0b';
      case 'pendiente':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="historial-item">
      <div className="historial-item-content">
        {/* Product Image */}
        <div className="historial-item-image-container">
          <img src={product.image} alt={product.name} className="historial-item-image" />
          <div className="image-overlay">
            <div className="quantity-badge">{product.quantity}</div>
          </div>
        </div>

        {/* Product Details */}
        <div className="historial-item-details">
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">Joyas únicas que cuentan historias</p>
          </div>
          
          <div className="order-info">
            <div className="order-number">{product.orderNumber}</div>
            <div className="order-date">{formatDate(product.date)}</div>
          </div>
        </div>

        {/* Status and Price */}
        <div className="historial-item-right">
          <div className="status-container">
            <span 
              className="status-text"
              style={{ color: getStatusColor(product.status) }}
            >
              {product.status}
            </span>
          </div>
          
          <div className="price-container">
            <div className="price-amount">${(product.price * product.quantity).toFixed(2)}</div>
            <div className="price-label">Total pagado</div>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="historial-item-hover">
        <div className="hover-content">
          <button className="reorder-btn">Volver a pedir</button>
          <button className="details-btn">Ver detalles</button>
        </div>
      </div>
    </div>
  );
};

export default HistorialItem;
