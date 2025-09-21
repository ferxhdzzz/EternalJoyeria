// src/components/Products-Private/CategoriaCard.jsx
import React from "react";
import "../../styles/shared/buttons.css";

const CategoriaCard = ({ categorie, onEdit, onDelete }) => {
  return (
    <div className="categoria-card">
      <div className="categoria-card__image">
        <img
          src={categorie.image || "/karinaaaaaa.jpg"}
          alt={categorie.name}
          style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <div className="categoria-card__body" style={{ padding: 12 }}>
        <h3 style={{ margin: "8px 0" }}>{categorie.name}</h3>
        {categorie.description && (
          <p style={{ marginBottom: 12, color: "#444" }}>{categorie.description}</p>
        )}

        <div className="ej-btn-set">
          <button
            type="button"
            className="ej-btn ej-approve ej-size-sm"
            onClick={() => onEdit?.(categorie)}
          >
            Editar
          </button>
          <button
            type="button"
            className="ej-btn ej-danger ej-size-sm"
            onClick={() => onDelete?.(categorie)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaCard;
