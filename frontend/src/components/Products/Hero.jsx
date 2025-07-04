import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/Hero.css'; // Imports the custom stylesheet for this component.

// Defines the Hero functional component.
const Hero = () => (
  // The main section element for the hero content.
  <section className="hero">
    {/* A container for all the content within the hero section. */}
    <div className="hero-content">
      {/* A container for the text part of the hero section. */}
      <div className="hero-text-container">
        {/* A wrapper for the text elements. */}
        <div className="hero-text">
          {/* The main headline of the hero section. */}
          <h1>Los mejores accesorios naturales</h1>

          {/* A container for the statistics. */}
          <div className="hero-stats">
            {/* The first statistic item. */}
            <div className="stat">
              {/* The number for the statistic. */}
              <span className="number">20+</span>
              {/* The label for the statistic. */}
              <span className="label">accesorios</span>
            </div>
            {/* A visual separator between the statistics. */}
            <div className="separator"></div>
            {/* The second statistic item. */}
            <div className="stat">
              {/* The number for the statistic. */}
              <span className="number">60+</span>
              {/* The label for the statistic. */}
              <span className="label">clientes felices</span>
            </div>
          </div>
        </div>
      </div>

      {/* A container for the hero image. */}
      <div className="hero-image">
        {/* The image displayed in the hero section. */}
        <img src="/Products/modelo1.png" alt="Modelo" />
      </div>
    </div>
  </section>
);

// Exports the Hero component to be used in other parts of the application.
export default Hero;
