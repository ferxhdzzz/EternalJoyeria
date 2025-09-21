// src/components/ReviewStats.jsx
import React from 'react';

const ReviewStats = ({ stats }) => {
  const { totalReviews, ratingDistribution } = stats;

  // Calcular porcentaje
  const getPercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="review-stats">
      <h4 className="stats-title">Reseñas de clientes</h4>
      
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage = getPercentage(count);

          return (
            <div key={rating} className="rating-row">
              <span className="rating-label">{rating} ⭐</span>
              <div className="rating-bar">
                <div
                  className="rating-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewStats;
