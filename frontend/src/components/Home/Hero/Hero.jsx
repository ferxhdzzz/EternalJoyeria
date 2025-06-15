import React from 'react'; // Imports the React library, essential for creating React components.
import HeroButton from '../HeroButton/HeroButton'; // Imports the HeroButton component for use in the hero section.
import './Hero.css'; // Imports the specific stylesheet for this component.

// Defines the Hero functional component.
const Hero = () => (
  // The <main> tag is used for the primary content of the document, with a class for styling.
  <main className="hero">
    {/* This div contains the textual content of the hero section. */}
    <div className="hero__content">
      {/* The main heading (H1) of the hero section. */}
      <h1>Brilla con Elegancia, Resplandece con Estilo</h1>
      {/* A paragraph providing more details and context. */}
      <p>
        Cada pieza de nuestra colección está diseñada para realzar tu belleza y reflejar tu estilo único. Desde elegantes anillos hasta deslumbrantes collares, encuentra el brillo que te hará inolvidable.
      </p>
      {/* The HeroButton component is used here, with "Compra ahora" as its child text. */}
      <HeroButton>Compra ahora</HeroButton>
    </div>
    {/* This div is intended to hold an image, but it's currently empty. */}
    <div className="hero__image">
     
    </div>
  </main>
);

// Exports the Hero component to be used in other parts of the application.
export default Hero;
