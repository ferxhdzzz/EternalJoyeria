import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/Hero.css'; // Imports the custom stylesheet for this component.

// Defines the Hero functional component.
const Hero = () => (
  <section className="hero hero-product-banner">
    <div className="hero-product-content">
      <h1 className="hero-product-title">Nuestros productos</h1>
    </div>
  </section>
);

// Exports the Hero component to be used in other parts of the application.
export default Hero;
