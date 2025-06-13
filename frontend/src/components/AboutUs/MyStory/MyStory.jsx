import React from 'react';
import './MyStory.css';

const MyStory = () => {
  // Paleta de colores extraída de la imagen de diseño
  const colorPalette = ['#a87c8b', '#6c4e59', '#d9c4c4', '#8b6b78'];

  return (
    <section className="my-story">
      <div className="my-story__image-wrapper">
        <div className="my-story__image-container">
          <img 
            src="/aboutUsimage.png" 
            alt="Creadora de Eternal Joyería" 
            className="my-story__image" 
          />
        </div>
        <div className="my-story__palette">
          {colorPalette.map((color, index) => (
            <div 
              key={index}
              className="my-story__palette-color"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>

      <div className="my-story__text-content">
        <h2 className="my-story__title">Mi historia</h2>
        <p className="my-story__text">
          Soy creadora de joyería y accesorios de acero, piedras naturales y flores exóticas, cultivadas y preservadas para la eternidad. He tratado de conservar la forma y el color original de cada flor, en especial las orquídeas, creando así una joya y accesorio único, original e irrepetible, que durará para siempre.
        </p>
      </div>
    </section>
  );
};

export default MyStory;
