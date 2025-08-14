import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 para navegación
import "../../styles/DashboardCss/categoryList.css";

const CategoryList = ({ categories }) => {
  const navigate = useNavigate();

  const handleClick = (catId) => {
    // Esto te lleva a /categorias/:id
    navigate(`/categorias/${catId}`);
  };

  return (
    <div className="category-list2">
      <h2>Categorías de productos</h2>

      {categories.length === 0 ? (
        <p>No hay categorías registradas.</p>
      ) : (
        categories.map((cat) => (
          <div
            className="category-item2"
            key={cat._id}
            onClick={() => handleClick(cat._id)}
            style={{ cursor: "pointer" }} // 👈 para mostrar que es clickable
          >
            <img
              src={cat.image || "/Products/defaultIcon.png"}
              alt={cat.name}
            />
            <div className="info">
              <span>{cat.name}</span>
            </div>
            <span className="arrow">›</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryList;
