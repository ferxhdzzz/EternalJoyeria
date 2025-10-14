// frontendPriv/src/components/reseñas/row/ResenaRow.jsx
import React from "react";
import Swal from "sweetalert2";
import "./ResenaRow.css"; // ✅ Asegúrate de que este archivo CSS exista (lo crearemos en el paso 2)
import "../../../styles/shared/buttons.css"; 

const ResenaRow = ({
  id_customer,
  rank,
  comment,
  id_product,
  images = [], // ✅ Se añade el manejo de imágenes
  onClick, // ✅ Se recibe la prop 'onClick' del padre
}) => {
  // ✅ Lógica robusta para obtener el nombre del cliente
  const nombre =
    typeof id_customer === "object"
      ? `${id_customer?.firstName || "Cliente"} ${id_customer?.lastName || "Anónimo"}`.trim()
      : "Cliente Anónimo";

  // ✅ Lógica robusta para obtener el nombre del producto
  const compra =
    typeof id_product === "object"
      ? id_product?.name || "Producto no especificado"
      : "Compra no especificada";

  // ✅ FUNCIÓN MEJORADA: Renderiza estrellas de calificación como en master
  const renderStars = (rating) => {
    const fullStar = "★";
    const emptyStar = "☆";
    return (
      <span className="rating-stars">
        {Array(5).fill(0).map((_, i) => (
          <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>
            {i < rating ? fullStar : emptyStar}
          </span>
        ))}
      </span>
    );
  };

  // ✅ FUNCIÓN MEJORADA: Muestra una imagen en grande al hacer clic
  const handleImageClick = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 'auto',
      imageHeight: 'auto',
      imageAlt: 'Imagen de la reseña',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { image: 'swal2-image-responsive' },
    });
  };

  // ✅ DISEÑO CORREGIDO: Se reemplaza <tr> por una estructura de <div> tipo "Card"
  return (
    <div className="resena-card">
      <div className="card-header">
        <h3 className="customer-name">{nombre}</h3>
        <div className="rating-display">{renderStars(rank)}</div>
      </div>

      <div className="card-body">
        <p className="review-comment">{String(comment)}</p>
        <p className="product-info"><strong>Producto:</strong> {compra}</p>
      </div>

      <div className="card-images">
        <strong>Imágenes:</strong>
        {images && images.length > 0 ? (
          <div className="resena-images-container">
            {images.slice(0, 3).map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Imagen de reseña ${index + 1}`}
                className="resena-thumbnail clickable"
                onClick={() => handleImageClick(imgUrl)}
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

      <div className="card-actions">
        {/* ✅ MANTENIDO: Tu botón personalizado, ahora conectado a la prop 'onClick' */}
        <button
          type="button"
          className="ej-btn ej-danger ej-size-sm"
          onClick={onClick} // <-- Se conecta a la función de eliminación del padre
          title="Eliminar reseña"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ResenaRow;