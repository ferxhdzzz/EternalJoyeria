import React from 'react';
import './ElegantCards.css';

const ElegantCards = () => {
  return (
    <section className="feature-cards-container">
      <div className="feature-card">
        <h3>Descubre nuestras colecciones</h3>
        <p>Explora joyas únicas y personalizadas para cada ocasión especial.</p>
      </div>
      <div className="feature-card">
        <h3>Comunidad de joyería</h3>
        <p>Únete a usuarios que comparten experiencias y consejos sobre accesorios elegantes.</p>
      </div>
      <div className="feature-card">
        <h3>Destaca con estilo</h3>
        <p>Encuentra piezas que resalten tu personalidad y sube en nuestros rankings de usuarios.</p>
      </div>
      <div className="feature-card">
        <h3>Recomendaciones diarias</h3>
        <p>Recibe sugerencias personalizadas de joyas basadas en tus preferencias.</p>
      </div>
      <div className="feature-card">
        <h3>Recordatorios suaves</h3>
        <p>Recibe notificaciones gentiles para descubrir nuevas ofertas y eventos.</p>
      </div>
    </section>
  );
};

export default ElegantCards;
