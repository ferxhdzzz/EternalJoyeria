// src/components/ReviewStats.jsx
import React from 'react';

const ReviewStats = ({ stats }) => {
  const { totalReviews, ratingDistribution } = stats;

  const getPercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const reviewStatsStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'normal',
    color: '#333',
    margin: '0',
  };

  const addReviewBtnStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #c2c2c2',
    padding: '8px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  const ratingDistributionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const chartRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '20px',
  };

  const ratingLabelStyle = {
    fontSize: '1rem',
    fontWeight: 'normal',
    color: '#555',
    width: '20px',
    textAlign: 'right',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  };
  
  const starStyle = {
    fill: '#FFD700',
    width: '12px',
    height: '12px',
    marginLeft: '5px',
  };

  const barContainerStyle = {
    flexGrow: 1,
    height: '8px',
    backgroundColor: '#e6e6e6',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const barFillStyle = (percentage) => ({
    height: '100%',
    backgroundColor: '#b05c60',
    borderRadius: '4px',
    width: `${percentage}%`,
    transition: 'width 0.5s ease-in-out',
  });

  const ratingCountStyle = {
    fontSize: '1rem',
    color: '#555',
    width: '15px',
    textAlign: 'right',
    flexShrink: 0,
  };

  return (
    <div style={reviewStatsStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Reseñas de clientes</h2>
        <button style={addReviewBtnStyle}>+ Agregar reseña</button>
      </div>

      <div style={ratingDistributionStyle}>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingDistribution[rating] || 0;
          const percentage = getPercentage(count);
          
          return (
            <div key={rating} style={chartRowStyle}>
              <div style={ratingLabelStyle}>
                <span style={{ fontSize: '1rem' }}>{rating}</span>
                <svg style={starStyle} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div style={barContainerStyle}>
                <div style={barFillStyle(percentage)}></div>
              </div>
              <span style={ratingCountStyle}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewStats;