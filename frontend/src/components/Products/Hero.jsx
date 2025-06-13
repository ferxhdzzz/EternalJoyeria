import React from 'react';
import '../../styles/Hero.css';

const Hero = () => (
  <section className="hero">
    <div className="hero-content">
      <div className="hero-text-container">
        <div className="hero-text">
          <h1>Los mejores accesorios naturales</h1>

          <div className="hero-stats">
            <div className="stat">
              <span className="number">20+</span>
              <span className="label">accesorios</span>
            </div>
            <div className="separator"></div>
            <div className="stat">
              <span className="number">60+</span>
              <span className="label">clientes felices</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src="/Products/modelo1.png" alt="Modelo" />
      </div>
    </div>
  </section>
);

export default Hero;
