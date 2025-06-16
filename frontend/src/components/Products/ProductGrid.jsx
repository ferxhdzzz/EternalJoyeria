import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductGrid.css';
import { products } from '../../data/products';

const ProductGrid = () => (
  <section className="product-grid">
    <h2>Algunos de nuestros productos</h2>

    <div className="grid">
      {products.map(({ id, name, price, img }) => (
        <Link to={`/product/${id}`} key={id} className="product-link">
          <div className="grid-item">
            <img src={img} alt={name} />
            <p className="product-name">{name}</p>
            <p className="product-price">${price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default ProductGrid;
