import React from 'react';
import Card from '../components/Products/Card';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';

const conjuntos = [
  {
    id: 'conjunto-floral',
    title: 'Conjunto Floral',
    description: 'Conjunto de collar y aretes con flores naturales encapsuladas.',
    image: '/Products/product6.png',
    price: '$69.99',
    oldPrice: '$89.99',
  },
  {
    id: 'conjunto-orquidea',
    title: 'Conjunto Orquídea',
    description: 'Set de joyería con orquídea natural, incluye collar y anillo.',
    image: '/Products/ConjuntoEternal.png',
    price: '$79.99',
    oldPrice: '$99.99',
  },
];

const CategoriaConjuntos = () => (
  <>
    <Nav />
    <div className="hero-product-banner">
      <div className="hero-product-content">
        <h1 className="hero-product-title">Conjuntos</h1>
      </div>
    </div>
    <div className="products-container" style={{ minHeight: '80vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
      <div className="products-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center' }}>
        {conjuntos.map(product => (
          <div key={product.id} className="product-card-container">
            <Card {...product} imageHeight={185} simplePrice={true} />
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </>
);

export default CategoriaConjuntos; 