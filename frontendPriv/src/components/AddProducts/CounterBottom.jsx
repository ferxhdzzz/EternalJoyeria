import React from 'react';

const CounterButton = ({ onClick, children }) => {
  return (
    <button className="quantity-counter-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default CounterButton;