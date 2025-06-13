import React from 'react';
import './MissionAndVision.css';

const MissionAndVision = () => {
  return (
    <section className="mission-vision">
      <div className="mission-vision__content">
        <h2 className="mission-vision__title">Nuestra visión y misión</h2>
        <div className="mission-vision__path-container">
          <svg className="mission-vision__path-svg" width="200" height="350" viewBox="0 0 200 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0 C-20 80, 220 120, 80 220 C-40 320, 180 350, 100 400" stroke="#848484" strokeWidth="1.5" strokeDasharray="4 4"/>
          </svg>
          <div className="mission-vision__text-block mission-vision__mission">
            <h3>Misión</h3>
            <p>Crear joyas únicas que realcen la belleza y celebren momentos inolvidables.</p>
          </div>
          <div className="mission-vision__text-block mission-vision__vision">
            <h3>Visión</h3>
            <p>Ser la marca que transforma emociones en joyas eternas.</p>
          </div>
        </div>
      </div>
      <div className="mission-vision__image-container">
        <img src="/MisionAndVisionImage.png" alt="Modelo con joyas de EternalJoyeria" />
      </div>
    </section>
  );
};

export default MissionAndVision;
