import React from 'react';
import Card from '../components/Products/Card';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';

const aretes = [
  {
    id: 'aretes-orquidea',
    title: 'Aretes de Orquídea',
    description: 'Aretes ligeros y sofisticados con orquídea natural en resina.',
    image: '/Products/AretesOrchid.png',
    price: '$29.99',
    oldPrice: '$39.99',
  },
  {
    id: 'aretes-elegantes',
    title: 'Aretes Elegantes',
    description: 'Aretes elegantes con diseño floral, perfectos para eventos especiales.',
    image: '/Products/product5.png',
    price: '$34.99',
    oldPrice: '$44.99',
  },
];

const CategoriaAretes = () => (
  <>
    <Nav />
    <div className="hero-product-banner">
      <div className="hero-product-content">
        <h1 className="hero-product-title">Aretes</h1>
      </div>
    </div>
    <div style={{ minHeight: '80vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', zIndex: 99999 }}>
        {aretes.map(product => (
          <div key={product.id} style={{ zIndex: 99999 }}>
            <Card {...product} imageHeight={185} simplePrice={true} />
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </>
);

export default CategoriaAretes; 