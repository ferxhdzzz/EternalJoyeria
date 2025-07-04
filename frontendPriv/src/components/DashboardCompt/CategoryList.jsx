import React from "react";
import "../../styles/DashboardCss/categoryList.css";

const categories = [
  { name: "Anillos", count: 3, icon: "/Products/iconoAnillos.png" },
  { name: "Pulseras", count: 5, icon: "/Products/iconoPulseras.png" },
  { name: "Collares", count: 2, icon: "/Products/iconoCollares.png" },
  { name: "Aritos", count: 11, icon: "/Products/iconoAritos.png" },
];

const CategoryList = () => {
  return (
    <div className="category-list2">
      <h2>Categorías de productos</h2>
      {categories.map((cat, i) => (
        <div className="category-item2" key={i}>
          <img src={cat.icon} alt={cat.name} />
          <div className="info">
            <span>{cat.name}</span>
            <small>Productos: {cat.count}</small>
          </div>
          <span className="arrow">›</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
