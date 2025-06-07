import React from 'react';
import '../../styles/Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonial-wrapper">
        <h2>¿Qué opinan los clientes acerca de Eternal Joyería?</h2>

        <div className="testimonial-cards">
          <div className="testimonial-box">
            <div className="client-info">
              <img src="/Products/client1.png" alt="Cliente 1" />
              <div>
                <h3>Josue Alejandro</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <p>
              Me he pedido joyas en esta tienda desde hace unos meses, me ha encantado la calidad y el empeño que le ponen a cada producto, lo recomiendo.
            </p>
          </div>

          <div className="testimonial-box">
            <div className="client-info">
              <img src="/Products/client2.png" alt="Cliente 2" />
              <div>
                <h3>Fernanda Mizel</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <p>
              Pedí una variedad de productos para mi novia, todos han sido de entrega rápida, y con una belleza excelente.
            </p>
          </div>

          <div className="testimonial-box">
            <div className="client-info">
              <img src="/Products/client3.png" alt="Cliente 3" />
              <div>
                <h3>Jennifer Teos</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <p>
              Me pedí un collar y dos anillos, que resultaron preciosos.
            </p>
          </div>
        </div>
        <div className="decorative-lines">
          <svg viewBox="0 0 600 400">
            <path d="M0,100 C150,200 450,0 600,100" fill="none" stroke="#f5dede" strokeDasharray="6,6" strokeWidth="2" />
            <path d="M0,300 C150,200 450,400 600,300" fill="none" stroke="#f5dede" strokeDasharray="6,6" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
