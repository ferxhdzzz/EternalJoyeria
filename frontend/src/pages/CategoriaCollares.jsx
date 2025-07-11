import React from 'react';
import Card from '../components/Products/Card';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';

const collares = [
  {
    id: 'collar-orquidea',
    title: 'Collar de Orquídea',
    description: 'Collar delicado con orquídea encapsulada, ideal para ocasiones especiales.',
    image: '/Products/CollarOrchid.png',
    price: '$39.99',
    oldPrice: '$59.99',
  },
  {
    id: 'collar-morado',
    title: 'Collar de orquidea morada',
    description: 'Un collar elegante con orquídea morada, ideal para cualquier ocasión.',
    image: '/Products/CollarMoradoEternal.png',
    price: '$39.99',
    oldPrice: '$59.99',
  },
  {
    id: 'collar-rosa',
    title: 'Collar de orquidea rosa',
    description: 'Un collar elegante con orquídea rosa, ideal para ocasiones especiales.',
    image: '/Products/CollarEternal.png',
    price: '$39.99',
    oldPrice: '$59.99',
  },
  {
    id: 'collar-mini',
    title: 'Collar mini dije',
    description: 'Sutil y elegante, este collar con un mini dije es la pieza perfecta para el uso diario.',
    image: '/Products/product4.png',
    price: '$29.99',
    oldPrice: '$39.99',
  },
];

const CategoriaCollares = () => (
  <>
    <Nav />
    <div className="hero-product-banner">
      <div className="hero-product-content">
        <h1 className="hero-product-title">Collares</h1>
      </div>
    </div>
    <div style={{ minHeight: '80vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center' }}>
        {collares.map(product => (
          <Card key={product.id} {...product} imageHeight={185} simplePrice={true} />
        ))}
      </div>
    </div>
    <Footer />
  </>
);

export default CategoriaCollares; 