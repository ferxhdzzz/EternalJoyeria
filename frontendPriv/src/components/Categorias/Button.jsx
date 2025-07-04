import React from 'react';
import './Button.css';

const Button = ({ text }) => {
  return (
    <button className="main-button">{text}</button>
  );
};

export default Button;
