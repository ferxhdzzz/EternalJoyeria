import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/Testimonials.css'; // Imports the custom stylesheet for this component.

// Defines the Testimonials functional component.
const Testimonials = () => {
  // Returns the JSX to be rendered.
  return (
    // The main section element for the testimonials.
    <section className="testimonials">
      {/* A wrapper for all content within the testimonials section, used for positioning. */}
      <div className="testimonial-wrapper">
        {/* The main heading for the testimonials section. */}
        <h2>¿Qué opinan los clientes acerca de Eternal Joyería?</h2>

        {/* A container for all the testimonial cards. */}
        <div className="testimonial-cards">
          {/* The first testimonial box, aligned to the left. */}
          <div className="testimonial-box left">
            {/* Contains the client's image and name. */}
            <div className="client-info">
              <img src="/Products/client2.png" alt="Fernanda Mizel" />
              <div>
                <h3>Fernanda Mizel</h3>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            {/* The client's testimonial text. */}
            <p>
              Me he pedido joyas en esta tienda desde hace unos meses, me ha encantado la calidad y el empeño que le ponen a cada producto, lo recomiendo.
            </p>
          </div>

          {/* The second testimonial box, aligned to the right. */}
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

          {/* The third testimonial box, aligned to the left. */}
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

        {/* A container for the decorative SVG lines in the background. */}
        <div className="decorative-lines">
          {/* SVG element for creating vector graphics. */}
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none">
            {/* A curved, dashed line path. 'd' attribute defines the shape (Move, Curve). */}
            <path d="M-50 100 C 200 300, 100 500, 300 700" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
            {/* A second curved, dashed line path, mirrored horizontally. */}
            <path d="M1050 100 C 800 300, 900 500, 700 700" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
            {/* A third curved, dashed line path in the middle. */}
            <path d="M300 200 C 400 400, 600 500, 500 800" fill="none" stroke="#f5dede" strokeDasharray="8,8" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

// Exports the Testimonials component for use in other parts of the application.
export default Testimonials;
