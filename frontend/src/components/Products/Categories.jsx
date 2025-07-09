import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import '../../styles/Categories.css';

// Relación de productos con categorías
const categoryMap = {
  'Conjuntos': [], // No hay conjuntos en el ejemplo
  'Collares': products.filter(p => p.title && p.title.toLowerCase().includes('collar')),
  'Aretes': products.filter(p => p.title && p.title.toLowerCase().includes('arete')),
  'Anillos': products.filter(p => p.title && p.title.toLowerCase().includes('anillo')),
  'Peinetas': products.filter(p => p.title && p.title.toLowerCase().includes('peineta'))
};

const categories = [
  { title: "Conjuntos" },
  { title: "Collares" },
  { title: "Aretes" },
  { title: "Anillos" },
  { title: "Peinetas" },
];

const Categories = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="categories-sidebar-container">
      <aside className="categories-sidebar">
        <h2 className="categories-title">Categorías</h2>
        <ul className="categories-list sidebar-list">
          {categories.map((cat, idx) => (
            <li
              key={cat.title}
              className="category-item sidebar-item"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <button className="category-btn sidebar-btn">
                <span>{cat.title}</span>
                <span className="arrow">▶</span>
              </button>
              {/* Submenu flotante */}
              {hoveredIdx === idx && (
                <div className="category-flyout"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <ul className="category-submenu sidebar-submenu">
                    {categoryMap[cat.title].length === 0 ? (
                      <li className="category-subitem" style={{color:'#aaa'}}>No hay productos en esta categoría</li>
                    ) : (
                      categoryMap[cat.title].map((prod) => (
                        <li key={prod.id} className="category-subitem sidebar-subitem">
                          <button style={{background:'none',border:'none',padding:0,color:'#333',fontWeight:500,cursor:'pointer'}} onClick={() => navigate(`/detalle-producto/${prod.id}`)}>
                            {prod.title}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Categories;
