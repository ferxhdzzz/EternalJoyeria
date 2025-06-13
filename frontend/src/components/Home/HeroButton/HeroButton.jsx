import React from 'react';
import './HeroButton.css';

const HeroButton = ({ onClick, children }) => (
  <button className="hero-button" onClick={onClick}>
    {children}
  </button>
);

export default HeroButton;
