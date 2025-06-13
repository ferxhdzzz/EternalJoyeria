import React from 'react';
import './HeroAboutUs.css';

const HeroAboutUs = ({ imageSrc, imageAlt = 'Imagen de fondo' }) => {
  const sectionClasses = `hero-about-us ${imageSrc ? 'has-image' : ''}`;

  return (
    <>
      {/* Este SVG define la forma de la curva y no es visible */}
      <svg height="0" width="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="hero-down-curve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0 L1,0.8 C0.75,1, 0.25,1, 0,0.8 Z" />
          </clipPath>
        </defs>
      </svg>

      <section className={sectionClasses}>
        {imageSrc && (
          <div className="hero-about-us__image-container">
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="hero-about-us__image"
            />
          </div>
        )}

        <div className="hero-about-us__content">
          <h1 className="hero-about-us__title">
            Joyas con alma <br /> natural
          </h1>
          <p className="hero-about-us__subtitle">
            Celebra cada momento con una pieza eterna, hecha con flores reales encapsuladas con amor.
          </p>
        </div>
      </section>
    </>
  );
};

export default HeroAboutUs;

