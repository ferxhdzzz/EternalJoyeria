import React, { useState } from 'react';
import '../../styles/RatingBox.css';
import florIzq from '../img/Menu/flor-izq.png';
import florDer from '../img/Menu/flor-der.png';

const RatingBox = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-box">
      <h3>¿Te gustaría calificarnos?</h3>
      
      <input type="text" placeholder="Nombre y apellido" className="input-field" />
      
      <textarea placeholder="Agrega tus comentarios" className="input-field textarea" />

      <div className="rating-decorated-row">
        <img src={florIzq} alt="Decoración izquierda" className="flor-icon" />

        <div className="rating-inner">
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

        <img src={florDer} alt="Decoración derecha" className="flor-icon" />
      </div>
    </div>
  );
};

export default RatingBox;
