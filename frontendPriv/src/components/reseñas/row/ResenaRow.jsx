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

  const renderStars = (rating) => {
    const fullStar = "★";
    const emptyStar = "☆";
    const maxStars = 5;

    return (
      <span className="rating-stars">
        {Array(maxStars).fill(0).map((_, i) => (
          <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>
            {i < rating ? fullStar : emptyStar}
          </span>
        ))}
      </span>
    );
  };

  const handleImageClick = (images, startIndex) => {
    if (images.length === 0) return;

    const steps = images.map((url) => ({
      html: `
        <div style="text-align: center;">
          <img src="${url}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px;">
          <p style="margin-top: 10px; font-size: 14px; color: #555;">
            ${nombre} | Producto: ${compra}
          </p>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
    }));

    Swal.mixin({
      currentProgressStep: startIndex,
      progressSteps: steps.map((_, i) => `Imagen ${i + 1}/${steps.length}`),
      customClass: {
        popup: 'custom-swal-image-popup',
        container: 'custom-swal-image-container'
      },
      width: 'auto',
      padding: '1em',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonText: 'Siguiente →',
      cancelButtonText: '← Anterior',
      beforeOpen: () => {
        const step = Swal.getProgressSteps().indexOf(
          Swal.getContainer().querySelector('.swal2-progress-step-active')
        );
        const stepsCount = Swal.getContainer().querySelectorAll('.swal2-progress-step').length;

        Swal.getConfirmButton().style.display = step === stepsCount - 1 ? 'none' : 'inline-block';
        Swal.getCancelButton().style.display = step === 0 ? 'none' : 'inline-block';
      },
    }).queue(steps);
  };

  return (
    <div className="resena-card">
      <div className="card-header">
        <h3 className="customer-name">{nombre}</h3>
        <div className="rating-display">{renderStars(rank)}</div>
      </div>

      <div className="card-body">
        <p className="review-comment"><strong>Comentario:</strong> {String(comment)}</p>
        <p className="product-info"><strong>Producto:</strong> {compra}</p>
      </div>

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

      <div className="card-actions">
        <EliminarButton onClick={onClick} confirmar />
      </div>
    </div>
  );
};

export default ResenaCard;
