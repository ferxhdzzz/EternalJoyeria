import React from 'react';
import '../../styles/ProductShowcase.css';
import prod1 from '../img/Menu/product1.png';
import prod2 from '../img/Menu/product2.png';
import prod3 from '../img/Menu/product3.png';

const products = [
  { name: "Natural Plants", price: "$20.00", img: prod1 },
  { name: "Artificial Plants", price: "$25.00", img: prod2 },
  { name: "Artificial Plants", price: "$30.00", img: prod3 },
];

const ProductShowcase = () => {
  return (
    <section className="product-showcase">
      <div className="showcase-content">
        <div className="text-section">
          <h2>Las mejores ofertas</h2>
          <p>Disfruta de nuestras ofertas más exclusivas del momento.</p>
        </div>
        <div className="products">
          {products.map((product, i) => (
            <div key={i} className="product">
              <img src={product.img} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <span>{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
