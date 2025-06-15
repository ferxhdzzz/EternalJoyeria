import React, { useState } from 'react'; // Imports React and the useState hook for managing component state.
import '../../styles/RatingBox.css'; // Imports the custom stylesheet for this component.

// Defines the RatingBox functional component.
const RatingBox = () => {
  // 'rating' state stores the selected star rating. 'setRating' is the function to update it.
  const [rating, setRating] = useState(0);
  // 'hover' state stores the star currently being hovered over.
  const [hover, setHover] = useState(0);

  // Returns the JSX to be rendered.
  return (
    // The main container for the rating box.
    <div className="rating-box">
      {/* A content wrapper for alignment and styling. */}
      <div className="rating-content">
        {/* The main heading for the rating box. */}
        <h3>¿Te gustaría calificarnos?</h3>

        {/* A text input field for the user's name. */}
        <input type="text" placeholder="Nombre y apellido" className="input-field" />

        {/* A textarea for user comments. */}
        <textarea placeholder="Agrega tus comentarios" className="input-field textarea" />

        {/* A row containing the star rating and decorative images. */}
        <div className="rating-row">
          {/* A decorative flower image on the left. */}
          <img src="/Products/flor-izq.png" alt="Flor izquierda" className="flor-icon flor-izq" />

          {/* The central part of the rating row containing the stars and button. */}
          <div className="rating-center">
            {/* The label for the star rating section. */}
            <p className="rating-label">¿Cuál es tu calificación?</p>
            {/* The container for the stars. */}
            <div className="stars">
              {/* Creates an array of 5 numbers and maps over it to render 5 stars. */}
              {[1, 2, 3, 4, 5].map((star) => (
                // Each star is a span element.
                <span
                  key={star} // The key is necessary for list rendering in React.
                  // The class is dynamic: 'filled' is added if the star's value is less than or equal to the current hover or rating value.
                  className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)} // Sets the rating when a star is clicked.
                  onMouseEnter={() => setHover(star)} // Sets the hover state when the mouse enters a star.
                  onMouseLeave={() => setHover(0)} // Resets the hover state when the mouse leaves.
                >
                  ★ {/* The star character. */}
                </span>
              ))}
            </div>
            {/* The submit button for the form. */}
            <button className="submit-button">Enviar</button>
          </div>

          {/* A decorative flower image on the right. */}
          <img src="/Products/flor-der.png" alt="Flor derecha" className="flor-icon flor-der" />
        </div>
      </div>
    </div>
  );
};

// Exports the RatingBox component for use in other parts of the application.
export default RatingBox;
