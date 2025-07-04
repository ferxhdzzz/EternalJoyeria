import React from 'react';
import HeroButton from '../HeroButton/HeroButton';
import './HomeHero.css'; // Specific styles for Home Hero

// Defines the Hero functional component.
const Hero = () => (
  <main className="home-hero">
    <div className="hero__content">
      {/* The main heading (H1) of the hero section. */}
      <h1>Brilla con Elegancia, Resplandece con Estilo</h1>
      {/* A paragraph providing more details and context. */}
      <p>
        Cada pieza de nuestra colección está diseñada para realzar tu belleza y reflejar tu estilo único. Desde elegantes anillos hasta deslumbrantes collares, encuentra el brillo que te hará inolvidable.
      </p>
      {/* The HeroButton component is used here, with "Compra ahora" as its child text. */}
      <HeroButton  to="/login">Compra ahora</HeroButton>
    </div>
    {/* This div is intended to hold an image, but it's currently empty. */}
    <div className="hero__image">
    </div>
  </main>
);

// Exports the Hero component to be used in other parts of the application.
export default Hero;
