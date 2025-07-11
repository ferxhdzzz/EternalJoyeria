import React from 'react';
import './HeroCards.css';

const HeroCards = () => {
  return (
    <>
      <section className="hero-cards-section">
        <div className="hero-cards-container">
          <div className="hero-cards-top-row">
            <div className="hero-card">
              <div className="hero-card-container">
                <div className="hero-card-images">
                  <img src="/Home/collarorchid.jpg" alt="Collar Orchid" className="hero-card-image image-1" />
                  <img src="/Home/resinorchid.jpg" alt="Resina Orchid" className="hero-card-image image-2" />
                  <img src="/Home/areteorchid.jpg" alt="Arete Orchid" className="hero-card-image image-3" />
                </div>
                <div className="hero-card-overlay"></div>
              </div>
              <div className="hero-card-content">
                <h3 className="hero-card-title">Descubre nuestra colección</h3>
                <p className="hero-card-description">
                  Explora piezas únicas diseñadas para realzar tu belleza natural y celebrar cada momento especial.
                </p>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-container">
                <div className="hero-card-videos">
                  <video src="/CollarRealizado.mp4" className="hero-card-video video-1" autoPlay muted loop playsInline></video>
                  <video src="/resinstep.mp4" className="hero-card-video video-2" autoPlay muted loop playsInline></video>
                  <video src="/preservacion .mp4" className="hero-card-video video-3" autoPlay muted loop playsInline></video>
                </div>
                <div className="hero-card-overlay"></div>
              </div>
              <div className="hero-card-content">
                <h3 className="hero-card-title">Calidad excepcional</h3>
                <p className="hero-card-description">
                  Cada joya es cuidadosamente elaborada con los mejores materiales para garantizar durabilidad y elegancia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroCards;
