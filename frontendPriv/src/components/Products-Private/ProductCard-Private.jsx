import React from 'react';
import '../../styles/ProductCard-Private.css';

const ProductCardPrivate = ({ product }) => {
  return (
    <div className="product-card-private">
      <img
        src={product.image}
        alt={product.name}
        className="product-image-private"
      />
      <h3 className="product-name-private">{product.name}</h3>

      <div className="product-price-info-private">
        <span className="original-price-private">
          ${product.originalPrice.toFixed(2)}
        </span>
        <span className="discount-tag-private">
          -{product.discount}%
        </span>
      </div>

      <p className="final-price-private">
        ${product.finalPrice.toFixed(2)}
      </p>

      <div className="product-actions-private">
        <button className="btn-edit-private">Editar</button>
        <button className="btn-delete-private">Eliminar</button>
      </div>
    </div>
  );
};

export default ProductCardPrivate;
