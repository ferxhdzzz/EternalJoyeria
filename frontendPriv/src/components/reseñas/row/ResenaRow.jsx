import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";
import Swal from "sweetalert2";



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

  // --- Función para generar estrellas de calificación ---
  const renderStars = (rating) => {
    const fullStar = "★";
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

  // --- NUEVA FUNCIÓN: Maneja el clic en las miniaturas ---
  const handleImageClick = (images, startIndex) => {
    if (images.length === 0) return;

    // Crea el contenido del carrusel/slider con las imágenes
    const steps = images.map((url) => ({
      title: "Imágenes de la Reseña",
      text: `${nombre} | Producto: ${compra}`,
      imageUrl: url,
      imageAlt: "Imagen de reseña",
      imageHeight: "auto",
      imageWidth: "100%",
      showCancelButton: false,
      confirmButtonText: "Cerrar",
    }));

    // Muestra el carrusel de SweetAlert2
    Swal.mixin({
      currentProgressStep: startIndex,
      progressSteps: steps.map((_, i) => `${i + 1}/${steps.length}`),
      showClass: { popup: "swal2-noanimation" },
      hideClass: { popup: "swal2-noanimation" },
    }).queue(steps);
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
                className="resena-thumbnail clickable"
                onClick={() => handleImageClick(images, index)}
              />
            ))}
            {images.length > 3 && (
              <span
                className="image-count clickable"
                onClick={() => handleImageClick(images, 3)}
              >
                +{images.length - 3}
              </span>
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