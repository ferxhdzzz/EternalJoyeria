import React from 'react';
import '../../styles/ProductGrid.css';
import product1 from '../img/Menu/product1.png';
import product2 from '../img/Menu/product2.png';
import product3 from '../img/Menu/product3.png';
import product4 from '../img/Menu/product4.png';
import product5 from '../img/Menu/product5.png';
import product6 from '../img/Menu/product6.png';

const products = [
  { name: "Collar con corazón", price: "$25.00", img: product1 },
  { name: "Pulsera flor", price: "$20.00", img: product2 },
  { name: "Anillo pastel", price: "$30.00", img: product3 },
  { name: "Collar mini dije", price: "$25.00", img: product4 },
  { name: "Pulsera rosa", price: "$35.00", img: product5 },
  { name: "Collar personalizado", price: "$30.00", img: product6 },
];

const ProductGrid = () => {
  return (
    <section className="product-grid">
  <h2>Algunos de nuestros productos</h2>
  <div className="grid">
    {products.map((p, i) => (
      <div key={i} className="grid-item">
        <img src={p.img} alt={p.name} />
        <p className="product-name">{p.name}</p>
        <p className="product-price">{p.price}</p>
      </div>
    ))}
  </div>
</section>
  );
};

export default ProductGrid;
