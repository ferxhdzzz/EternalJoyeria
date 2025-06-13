import React from 'react';
import '../../styles/ProductShowcase.css';

const products = [
  { name: 'Natural Plants', price: '$20.00', img: '/Products/product1.png' },
  { name: 'Artificial Plants', price: '$25.00', img: '/Products/product2.png' },
  { name: 'Artificial Plants', price: '$30.00', img: '/Products/product3.png' },
];

const ProductShowcase = () => (
  <section className="product-showcase">
    <div className="showcase-content">
      <div className="text-section">
        <h2>Las mejores ofertas</h2>
        <p>Disfruta de nuestras ofertas más exclusivas del momento.</p>
      </div>
      <div className="products">
        {products.map(({ name, price, img }) => (
          <div key={name} className="product">
            <img src={img} alt={name} />
            <div className="product-info">
              <h4>{name}</h4>
              <span>{price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductShowcase;
