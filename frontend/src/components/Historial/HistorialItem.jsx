import React from "react";
import "./HistorialItem.css";

const HistorialItem = ({ product }) => {
  return (
    <div className="historial-item">
      <div className="historial-item-content">
        {/* Imagen del producto */}
        <div className="historial-item-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="historial-item-image"
          />
          <div className="image-overlay">
            <div className="quantity-badge">{product.quantity}</div>
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="historial-item-details">
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">
              Joyas únicas que cuentan historias
            </p>
          </div>
          <div className="order-number">Cantidad</div>
          <div className="order-date">{product.quantity}</div>
        </div>

        {/* Precio unitario */}
        <div className="historial-item-right">
          <div className="price-container">
            <div className="price-amount">
              ${product.price?.toFixed(2) || "0.00"}
            </div>
            <div className="price-label">Precio unitario</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialItem;
