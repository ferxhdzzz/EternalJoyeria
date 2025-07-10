import React, { useState } from 'react';
import './CategoryTabs.css';

const tabs = [
  'Productos',
  'Categoría',
  'Sobre Nosotros',
  'Contáctanos'
];

export default function CategoryTabs() {
  const [active, setActive] = useState(1); // Por defecto "Categoría" activa

  return (
    <div className="category-tabs-bg">
      <nav className="category-tabs">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`category-tab${active === idx ? ' active' : ''}`}
            onClick={() => setActive(idx)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
} 