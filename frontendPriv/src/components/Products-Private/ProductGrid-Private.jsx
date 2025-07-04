import React from 'react';
import ProductCardPrivate from './ProductCard-Private';
import '../../styles/ProductGrid-Private.css';

const ProductGridPrivate = ({ products }) => {
  return (
    <div className="product-grid-private">
      {products.map((product) => (
        <ProductCardPrivate key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGridPrivate;