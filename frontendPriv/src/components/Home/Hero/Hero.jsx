import React from 'react';
import HeroButton from '../HeroButton/HeroButton';
import './HomeHero.css'; // Specific styles for Home Hero

const Hero = () => (
  <main className="home-hero">
    <div className="hero__content">
      <h1>Brilla con Elegancia, Resplandece con Estilo</h1>
      <p>
        Cada pieza de nuestra colección está diseñada para realzar tu belleza y reflejar tu estilo único. Desde elegantes anillos hasta deslumbrantes collares, encuentra el brillo que te hará inolvidable.
      </p>
      <HeroButton  to="/login">Compra ahora</HeroButton>
    </div>
    <div className="hero__image">
    </div>
  </main>
);

export default Hero;
