import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";

const ResenaCard = ({
  id_customer,
  rank,
  comment,
  id_product,
  images = [],
  onClick,
}) => {
  const nombre =
    typeof id_customer === "object"
      ? `${id_customer?.firstName || "Cliente"} ${id_customer?.lastName || "Desconocido"}`
      : "ID: " + String(id_customer);

  const compra =
    typeof id_product === "object"
      ? `${id_product?.name || "Producto Desconocido"}`
      : "ID Producto: " + String(id_product);

  // Función para generar estrellas de calificación
  const renderStars = (rating) => {
    const fullStar = "★"; // Puedes cambiar por un ícono o emoji
    const emptyStar = "☆";
    const maxStars = 5;

    return (
      <span className="rating-stars">
        {Array(maxStars)
          .fill(0)
          .map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9" }}>
              {i < rating ? fullStar : emptyStar}
            </span>
          ))}
      </span>
    );
  };

  return (
    <div className="resena-card">
      {/* Cabecera de la tarjeta: Nombre y Calificación */}
      <div className="card-header">
        <h3 className="customer-name">{nombre}</h3>
        <div className="rating-display">{renderStars(rank)}</div>
      </div>

      {/* Comentario */}
      <div className="card-body">
        <p className="review-comment">
          <strong>Comentario:</strong> {String(comment)}
        </p>
        <p className="product-info">
          <strong>Producto:</strong> {compra}
        </p>
      </div>

      {/* Imágenes */}
      <div className="card-images">
        <strong>Imágenes:</strong>
        {images.length > 0 ? (
          <div className="resena-images-container">
            {images.slice(0, 3).map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Reseña imagen ${index + 1}`}
                className="resena-thumbnail"
              />
            ))}
            {images.length > 3 && (
              <span className="image-count">+{images.length - 3}</span>
            )}
          </div>
        ) : (
          <span className="no-image-text">Sin imagen</span>
        )}
      </div>

      {/* Acción de Eliminar */}
      <div className="card-actions">
        <EliminarButton onClick={onClick} confirmar />
      </div>
    </div>
  );
};

export default ResenaCard;
