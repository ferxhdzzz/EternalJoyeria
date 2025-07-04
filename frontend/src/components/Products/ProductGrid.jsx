import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductGrid.css';
import { products } from '../../data/products';

// Defines the ProductGrid functional component.
const ProductGrid = () => (
  // The main section element for the product grid.
  <section className="product-grid">
    {/* The title for the product grid section. */}
    <h2>Algunos de nuestros productos</h2>

    {/* A container for the grid of products. */}
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

// Exports the ProductGrid component to be used in other parts of the application.
export default ProductGrid;
