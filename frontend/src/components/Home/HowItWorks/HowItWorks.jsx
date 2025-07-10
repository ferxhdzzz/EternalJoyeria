import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="white-space-top"></div>
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <div className="how-it-works-text">
            <h2>App móvil</h2>
          </div>
        </div>
        
        <div className="how-it-works-content">
          <div className="card-column">
            <div className="card">
              <div className="card-content">
                <p className="card-title">Compra desde tu móvil</p>
                <p className="card-para">Accede a nuestra joyería en cualquier momento. Fácil, rápido y seguro.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <p className="card-title">Seguimiento de pedidos</p>
                <p className="card-para">Consulta el estado de tu compra en tiempo real desde nuestra app.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <p className="card-title">Ofertas exclusivas</p>
                <p className="card-para">Recibe descuentos especiales solo disponibles para usuarios de la app.</p>
              </div>
            </div>
          </div>

          <div className="phone-wrapper">
            <img src="/Home/PhoneEternal.png" alt="Mockup App móvil" className="phones-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
