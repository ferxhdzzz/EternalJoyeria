import React from 'react';
import './OverlayCards.css';

const OverlayCards = () => {
  return (
    <section className="brillo-section">
      <div className="brillo-container">
        <div className="brillo-content">
          <div className="brillo-text">
            <h2>Encuentra tu brillo,<br/>Donde sea y cuando<br/>quieras</h2>
          </div>
          <div className="brillo-description">
            <p>Ya sea que busques un detalle para el día a día o una pieza que marque un momento especial, EternalJoyería te ayuda a expresar tu estilo con joyas elegantes y atemporales — en cualquier momento.</p>
          </div>
          {/* <div className="brillo-video-card" style={{ position: 'relative', width: '400px', height: '320px', margin: '0 auto' }}>
            <div className="hero-card-videos">
              <video src="/CollarRealizado.mp4" className="hero-card-video video-1" autoPlay loop muted playsInline />
              <video src="/resinstep.mp4" className="hero-card-video video-2" autoPlay loop muted playsInline />
              <video src="/preservacion .mp4" className="hero-card-video video-3" autoPlay loop muted playsInline />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default OverlayCards;
