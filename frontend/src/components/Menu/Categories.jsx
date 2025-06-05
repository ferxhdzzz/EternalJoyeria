import React from 'react';
import '../../styles/Categories.css';
import cat1 from '../img/Menu/categoria1.png';
import cat2 from '../img/Menu/categoria2.png';
import cat3 from '../img/Menu/categoria3.png';
import cat4 from '../img/Menu/categoria4.png';
import cat5 from '../img/Menu/categoria5.png';
import cat6 from '../img/Menu/categoria6.png';

const categories = [
  { title: "Collares", img: cat1 },
  { title: "Fanillos", img: cat2 },
  { title: "Accesorios para cabello", img: cat3 },
  { title: "Bracaletes", img: cat4 },
  { title: "Conjuntos", img: cat5 },
  { title: "Aretes", img: cat6 },
];

const Categories = () => {
  return (
    <section className="categories">
      <h2>Categorías</h2>
      <div className="diamond-layout">
        {categories.map((c, i) => (
          <div key={i} className={`cat cat-${i + 1}`}>
            <img src={c.img} alt={c.title} />
            <span>{c.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
