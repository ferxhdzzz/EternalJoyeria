import React from 'react';
import './OurValues.css';

const OurValues = () => {
  const values = [
    {
      title: 'Exclusividad',
      description: 'Nuestras colecciones están pensadas para quienes buscan piezas únicas que reflejen su identidad.',
      className: 'exclusividad'
    },
    {
      title: 'Artesanía',
      description: 'Cada pieza es creada con atención al detalle, combinando técnicas tradicionales con diseños modernos.',
      className: 'artesania'
    },
    {
      title: 'Calidad',
      description: 'Solo trabajamos con materiales nobles y duraderos que garantizan belleza a lo largo del tiempo.',
      className: 'calidad'
    }
  ];

  return (
    <section className="our-values">
      <h2 className="our-values__title">Nuestros valores</h2>
      <div className="our-values__cards-container">
        {values.map((value, index) => (
          <div key={index} className={`our-values__card ${value.className}`}>
            <h3 className="our-values__card-title">{value.title}</h3>
            <p className="our-values__card-description">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurValues;
