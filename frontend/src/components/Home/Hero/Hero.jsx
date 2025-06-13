import React from 'react';
import HeroButton from '../HeroButton/HeroButton';
import './Hero.css'; // Ensure this line is present and correct

const Hero = () => (
  <main className="hero">
    <div className="hero__content">
      <h1>Brilla con Elegancia, Resplandece con Estilo</h1>
      <p>
        Cada pieza de nuestra colección está diseñada para realzar tu belleza y reflejar tu estilo único. Desde elegantes anillos hasta deslumbrantes collares, encuentra el brillo que te hará inolvidable.
      </p>
      <HeroButton  to="/login">Compra ahora</HeroButton>
    </div>
    <div className="hero__image">
      <img src="/GroupOrchid.png" alt="Orquídea" className="hero__image-foreground" />
    </div>
  </main>
);

export default Hero;
