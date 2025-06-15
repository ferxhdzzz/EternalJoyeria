// src/components/Carrito/BuyButton/BuyButton.jsx
import React from 'react';
import './ButtonCart.css';

const BuyButton = ({ onClick, children }) => {
  return (
    <button className="buy-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default BuyButton;
