import React, { useState } from 'react';
import '../../styles/AddProducts/CategorySelector.css';

const categories = [
  { name: 'Anillos', img: '/Products/product1.png' },
  { name: 'Accesorios', img: '/Products/product2.png' },
  { name: 'Aretes', img: '/Products/product3.png' },
  { name: 'Collares', img: '/Products/product4.png' },
];

const CategorySelector = () => {
  const [selected, setSelected] = useState(2);

  return (
    <div className="category-selector">
      {categories.map((cat, index) => (
        <div
          key={cat.name}
          className={`category-item ${selected === index ? 'selected' : ''}`}
          onClick={() => setSelected(index)}
        >
          <img src={cat.img} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
