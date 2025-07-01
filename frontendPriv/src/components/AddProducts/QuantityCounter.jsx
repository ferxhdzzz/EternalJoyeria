import React, { useState } from 'react';
import '../../styles/AddProducts/QuantityCounter.css';
import CounterButton from './CounterBottom';

const QuantityCounter = () => {
  const [count, setCount] = useState(1);

  return (
    <div className="quantity-counter">
      <CounterButton onClick={() => setCount(prev => Math.max(1, prev - 1))}>−</CounterButton>
      <span>{count}</span>
      <CounterButton onClick={() => setCount(prev => prev + 1)}>+</CounterButton>
    </div>
  );
};

export default QuantityCounter;
