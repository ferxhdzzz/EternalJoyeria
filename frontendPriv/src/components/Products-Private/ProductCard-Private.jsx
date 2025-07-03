import React from 'react';
import '../../styles/CardProd.css';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const ProductCardPrivate = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card-privates">
      <img
        src={product.image}
        alt={product.name}
        className="product-image-privates"
      />
      <h3 className="product-name-privates">{product.name}</h3>

      <div className="product-price-info-privates">
        <span className="original-price-privates">
          ${product.originalPrice.toFixed(2)}
        </span>
        <span className="discount-tag-privates">
          -{product.discount}%
        </span>
      </div>

      <p className="final-price-privates">
        ${product.finalPrice.toFixed(2)}
      </p>

      <div className="product-actions-privates">
        <EditButton onClick={() => onEdit(product)} />
        <DeleteButton onClick={() => onDelete(product)} />
      </div>
    </div>
  );
};

export default ProductCardPrivate;
