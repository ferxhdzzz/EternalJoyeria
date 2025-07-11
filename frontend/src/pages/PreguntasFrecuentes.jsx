import React, { useState } from 'react';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import '../styles/FAQ.css';

const preguntas = [
  {
    pregunta: '¿Cuánto tarda en llegar mi pedido?',
    respuesta: 'El tiempo de entrega depende de tu ubicación, pero normalmente los pedidos llegan entre 2 y 5 días hábiles en El Salvador.'
  },
  {
    pregunta: '¿Puedo personalizar una joya?',
    respuesta: '¡Sí! Ofrecemos opciones de personalización en algunos productos. Contáctanos para más detalles.'
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Aceptamos tarjetas de crédito, débito y pagos por transferencia bancaria.'
  },
  {
    pregunta: '¿Hacen envíos internacionales?',
    respuesta: 'Por el momento solo realizamos envíos dentro de El Salvador.'
  },
  {
    pregunta: '¿Qué hago si mi pedido llega dañado?',
    respuesta: 'Por favor contáctanos de inmediato con fotos del producto y te ayudaremos a resolverlo lo antes posible.'
  },
  {
    pregunta: '¿Cómo puedo cuidar mis joyas?',
    respuesta: 'Evita el contacto con agua, perfumes y productos químicos. Guarda tus joyas en un lugar seco y seguro.'
  }
];

const PreguntasFrecuentes = () => {
  const [abierta, setAbierta] = useState(null);

  const toggle = (idx) => {
    setAbierta(abierta === idx ? null : idx);
  };

  return (
    <>
      <Nav />
      <div className="faq-container">
        <h1 className="faq-title">Preguntas Frecuentes</h1>
        <div className="faq-list">
          {preguntas.map((item, idx) => (
            <div className={`faq-item${abierta === idx ? ' open' : ''}`} key={idx}>
              <button className="faq-question" onClick={() => toggle(idx)}>
                {item.pregunta}
                <span className="faq-icon">{abierta === idx ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: abierta === idx ? '200px' : '0' }}>
                <p>{item.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PreguntasFrecuentes; 