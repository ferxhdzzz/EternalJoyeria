import React, { useState } from 'react';
import '../../styles/AddProducts/QuantityCounter.css';

const QuantityCounter = () => {
  const [count, setCount] = useState(1);

  return (
    <div className="quantity-counter">
      <button onClick={() => setCount(prev => Math.max(1, prev - 1))}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
    </div>
  );
};

export default QuantityCounter;
