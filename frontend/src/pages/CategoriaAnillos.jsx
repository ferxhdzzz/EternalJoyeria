import React from 'react';
import Card from '../components/Products/Card';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';

const anillos = [
  {
    id: 'anillo-orquidea',
    title: 'Anillo de Orquídea',
    description: 'Anillo artesanal con orquídea natural preservada en resina. Pieza única y elegante.',
    image: '/Products/AnilloOrchid.png',
    price: '$34.99',
    oldPrice: '$49.99',
  },
  {
    id: 'anillo-pastel',
    title: 'Anillo pastel',
    description: 'Un anillo encantador en tonos pastel, ideal para complementar un look suave y sofisticado.',
    image: '/Products/product3.png',
    price: '$24.99',
    oldPrice: '$34.99',
  },
];

const CategoriaAnillos = () => (
  <>
    <Nav />
    <div className="hero-product-banner">
      <div className="hero-product-content">
        <h1 className="hero-product-title">Anillos</h1>
      </div>
    </div>
    <div className="products-container" style={{ minHeight: '80vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
      <div className="products-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center' }}>
        {anillos.map(product => (
          <div key={product.id} className="product-card-container">
            <Card {...product} imageHeight={185} simplePrice={true} />
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </>
);

export default CategoriaAnillos; 