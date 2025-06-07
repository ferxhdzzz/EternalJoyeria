import React from 'react';
import '../../styles/ProductGrid.css';

const products = [
  { name: 'Collar con corazón',    price: '$25.00', img: '/Products/product1.png' },
  { name: 'Pulsera flor',          price: '$20.00', img: '/Products/product2.png' },
  { name: 'Anillo pastel',         price: '$30.00', img: '/Products/product3.png' },
  { name: 'Collar mini dije',      price: '$25.00', img: '/Products/product4.png' },
  { name: 'Pulsera rosa',          price: '$35.00', img: '/Products/product5.png' },
  { name: 'Collar personalizado',  price: '$30.00', img: '/Products/product6.png' },
];

const ProductGrid = () => (
  <section className="product-grid">
    <h2>Algunos de nuestros productos</h2>

    <div className="grid">
      {products.map(({ name, price, img }) => (
        <div key={name} className="grid-item">
          <img src={img} alt={name} />
          <p className="product-name">{name}</p>
          <p className="product-price">{price}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ProductGrid;
