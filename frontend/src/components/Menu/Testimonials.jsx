import React from 'react';
import '../../styles/Testimonials.css';
import client1 from '../img/Menu/client1.png';
import client2 from '../img/Menu/client2.png';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Clientes felices</h2>
      <div className="testimonial-cards">
        <div className="testimonial">
          <img src={client1} alt="Cliente feliz" />
          <p>"Lo amé, la calidad es increíble y llegó rapidísimo!"</p>
        </div>
        <div className="testimonial">
          <img src={client2} alt="Cliente feliz" />
          <p>"Es más hermoso de lo que imaginaba, definitivamente compraré de nuevo."</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
