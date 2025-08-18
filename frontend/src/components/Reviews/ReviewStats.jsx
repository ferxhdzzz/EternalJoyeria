import React from 'react';

// Componente para mostrar estadísticas de reseñas
const ReviewStats = ({ stats }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  // Calcular porcentajes para cada calificación
  const getPercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="review-stats">
      <div className="stats-container">
        {/* Calificación promedio */}
        <div className="average-rating-section">
          <div className="average-rating-display">
            <span className="average-number">{averageRating}</span>
            <div className="average-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill={star <= averageRating ? "#FFD700" : "#E0E0E0"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="total-count">{totalReviews} reseñas</span>
          </div>
        </div>

        {/* Distribución de calificaciones */}
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = ratingDistribution[rating] || 0;
            const percentage = getPercentage(count);
            
            return (
              <div key={rating} className="rating-bar">
                <div className="rating-label">
                  <span className="rating-number">{rating}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información adicional */}
      <div className="stats-info">
        <div className="info-item">
        
         
        </div>
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          <span>Envío rápido y empaque seguro</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats; 