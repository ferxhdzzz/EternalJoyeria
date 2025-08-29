import React from 'react';
import HistorialItem from './HistorialItem';
import './HistorialVenta.css';

const HistorialVenta = ({ venta }) => {
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
    <div className="historial-venta">
      <div className="venta-header">
        <div className="venta-info">
          <span className="info-label">Fecha de compra:</span>
          <span className="info-value">{formatDate(venta.date)}</span>
        </div>
        <div className="venta-info">
          <span className="info-label">Estado:</span>
          <span 
            className="status-text"
            style={{ color: getStatusColor(venta.status) }}
          >
            {venta.status}
          </span>
        </div>
        <div className="venta-total">
          <span className="total-label">Total a pagar:</span>
          <span className="total-amount">${venta.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="venta-productos">
        {venta.products.map((product, index) => (
          <HistorialItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HistorialVenta;