import React from 'react';
import './AnimatedCard.css';

const AnimatedCard = ({ title, description, buttonText }) => {
  return (
    <div className="animated-card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <button className="card-button">{buttonText}</button>
    </div>
  );
};

export default AnimatedCard;
