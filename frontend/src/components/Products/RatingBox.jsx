import React, { useState } from 'react';
import '../../styles/RatingBox.css';

const RatingBox = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-box">
      <div className="rating-content">
        <h3>¿Te gustaría calificarnos?</h3>

        <input type="text" placeholder="Nombre y apellido" className="input-field" />

        <textarea placeholder="Agrega tus comentarios" className="input-field textarea" />

        <div className="rating-row">
          <img src="/Products/flor-izq.png" alt="Flor izquierda" className="flor-icon flor-izq" />

          <div className="rating-center">
            <p className="rating-label">¿Cuál es tu calificación?</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="submit-button">Enviar</button>
          </div>

          <img src="/Products/flor-der.png" alt="Flor derecha" className="flor-icon flor-der" />
        </div>
      </div>
    </div>
  );
};

export default RatingBox;
