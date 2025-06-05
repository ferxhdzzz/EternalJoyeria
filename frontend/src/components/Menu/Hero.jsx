import React from 'react';
import '../../styles/Hero.css';
import modelImage from '../img/Menu/modelo.png';

const Hero = () => {
  return (
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
          <img src={modelImage} alt="Modelo" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
