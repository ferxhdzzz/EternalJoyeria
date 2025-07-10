import React from 'react';
import './Reviews.css';

const Reviews = () => {
  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">¿Qué opinan nuestros clientes?</h2>
        <div className="reviews-row">
          {/* Card 1 */}
          <div className="card">
            <div className="first-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" className="avatar" alt="Jennifer Teos" />
                <h3 className="name">Jennifer Teos</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">¡Me encantó! La calidad del producto es excelente.</p>
              </div>
            </div>
            <div className="second-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/men/2.jpg" className="avatar" alt="Carlos López" />
                <h3 className="name">Carlos López</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Entrega rápida y atención muy buena.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="first-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/women/3.jpg" className="avatar" alt="Alicia Jn" />
                <h3 className="name">Alicia Jn</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Excelente servicio. Todo llegó perfecto.</p>
              </div>
            </div>
            <div className="second-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/men/4.jpg" className="avatar" alt="Kevin Teos" />
                <h3 className="name">Kevin Teos</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Muy satisfecho con la atención. Repetiré.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="first-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/women/5.jpg" className="avatar" alt="Sofía Reyes" />
                <h3 className="name">Sofía Reyes</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Buena presentación y productos de calidad.</p>
              </div>
            </div>
            <div className="second-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/men/6.jpg" className="avatar" alt="Luis Romero" />
                <h3 className="name">Luis Romero</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Me encantó el empaque, muy detallado.</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card">
            <div className="first-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/women/7.jpg" className="avatar" alt="María Pérez" />
                <h3 className="name">María Pérez</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Lo recomiendo, quedó mejor de lo esperado.</p>
              </div>
            </div>
            <div className="second-content">
              <div className="review">
                <img src="https://randomuser.me/api/portraits/men/8.jpg" className="avatar" alt="Esteban Díaz" />
                <h3 className="name">Esteban Díaz</h3>
                <div className="stars">★★★★★</div>
                <p className="comment">Todo perfecto, excelente calidad y precio.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews; 