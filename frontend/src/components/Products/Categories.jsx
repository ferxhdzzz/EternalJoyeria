import React from 'react';
import '../../styles/Categories.css';

const categories = [
  { title: "Collares", img: "/Products/categoria1.png" },
  { title: "Fanillos", img: "/Products/categoria2.png" },
  { title: "Accesorios para cabello", img: "/Products/categoria3.png" },
  { title: "Bracaletes", img: "/Products/categoria4.png" },
  { title: "Conjuntos", img: "/Products/categoria5.png" },
  { title: "Aretes", img: "/Products/categoria6.png" },
];

const Categories = () => (
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

export default Categories;
