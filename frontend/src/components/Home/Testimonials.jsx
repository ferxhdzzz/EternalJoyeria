import React from 'react';
import './Testimonials.css';

const testimonios = [
  {
    nombre: 'María G.',
    texto: 'Las joyas son hermosas y la atención fue excelente. ¡Repetiré mi compra!'
  },
  {
    nombre: 'Ana P.',
    texto: 'Me encantó la calidad y el diseño, superó mis expectativas.'
  },
  {
    nombre: 'Lucía R.',
    texto: 'Un detalle único para un momento especial. ¡Gracias EternalJoyería!'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-title-container">
        <h2 className="testimonials-title">
          ¿Qué opinan nuestros<br />clientes?
        </h2>
      </div>
      <div className="testimonials-list">
        {testimonios.map((t, idx) => (
          <div className="testimonial-item" key={idx}>
            <p className="testimonial-text">"{t.texto}"</p>
            <span className="testimonial-author">- {t.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials; 