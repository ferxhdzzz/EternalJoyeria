import React from 'react';
import '../../styles/Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonial-wrapper">
        <h2>¿Qué opinan los clientes acerca de Eternal Joyería?</h2>

        <div className="testimonial-cards">
          <div className="testimonial-box left">
            <div className="client-info">
              <img src="/Products/client2.png" alt="Fernanda Mizel" />
              <div>
                <h3>Fernanda Mizel</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <p>
              Me he pedido joyas en esta tienda desde hace unos meses, me ha encantado la calidad y el empeño que le ponen a cada producto, lo recomiendo.
            </p>
          </div>

          <div className="testimonial-box right">
            <div className="client-info">
              <img src="/Products/client1.png" alt="Josue Alejandro" />
              <div>
                <h3>Josue Alejandro</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <p>
              Pedí una variedad de productos para mi novia, todos han sido de entrega rápida, y con una belleza excelente.
            </p>
          </div>

          <div className="testimonial-box left">
            <div className="client-info">
              <img src="/Products/client3.png" alt="Jennifer Teos" />
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
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none">
            <path d="M-50 100 C 200 300, 100 500, 300 700" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
            <path d="M1050 100 C 800 300, 900 500, 700 700" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
            <path d="M300 200 C 400 400, 600 500, 500 800" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
