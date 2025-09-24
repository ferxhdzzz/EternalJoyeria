// frontend/src/components/Reviews/ReviewItem.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./ReviewList.css";
import "../../styles/shared/buttons.css";
import "../../styles/shared/modal.css";
import EJModal from "../ui/EJModal";

const ReviewItem = ({ review }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const images = Array.isArray(review?.images) ? review.images : [];

  const openGallery = (index) => {
    setSelectedImageIndex(index ?? 0);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
    setSelectedImageIndex(null);
  };

  const handleNext = useCallback(() => {
    if (!images.length || selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length, selectedImageIndex]);

  const handlePrev = useCallback(() => {
    if (!images.length || selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images.length, selectedImageIndex]);

  // Navegación con teclado dentro de la galería
  useEffect(() => {
    if (!showGallery) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showGallery, handleNext, handlePrev]);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rank) => {
    if (!rank || rank < 1)
      return <span className="no-rating">Sin calificación</span>;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rank ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const userName = review?.id_customer?.firstName || "Anónimo";
  const productName = review?.id_product?.name || "Producto desconocido";
  const productImage =
    review?.id_product?.images?.[0] || "https://placehold.co/150x150";

  return (
    <div className="historial-item-content">
      {/* Imagen del producto */}
      <div className="historial-item-image-container">
        <img
          src={productImage}
          alt={productName}
          className="historial-item-image"
        />
      </div>

      {/* Detalles */}
      <div className="historial-item-details">
        <div className="product-info">
          <h3 className="product-name">{productName}</h3>
        </div>

        <div className="review-body-content">
          <div className="review-text-and-rating">
            <div className="review-comment-section">
              <p className="review-comment-text">
                {review?.comment?.trim() || "Sin comentario"}
              </p>
              <p className="user-name">Por: {userName}</p>
            </div>
            <div className="review-rating">{renderStars(review?.rank)}</div>
            <p className="order-date">{formatDate(review?.createdAt)}</p>
          </div>

          {/* Sección de imágenes adjuntas */}
          {images.length > 0 && (
            <div className="review-images-section">
              <p className="review-images-label">Imágenes adjuntas:</p>
              <div className="review-images">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Imagen de reseña ${index + 1}`}
                    className="review-image"
                    onClick={() => openGallery(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Galería con EJModal (unificado) */}
      <EJModal
        isOpen={showGallery}
        onClose={closeGallery}
        title={
          images.length
            ? `Imagen ${selectedImageIndex + 1} de ${images.length}`
            : "Imagen"
        }
        footer={
          <>
            {/* Prev / Next dentro del footer para mantener patrón de botones pastel */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="ej-btn ej-size-sm"
                  onClick={handlePrev}
                >
                  ❮ Anterior
                </button>
                <button
                  type="button"
                  className="ej-btn ej-size-sm"
                  onClick={handleNext}
                >
                  Siguiente ❯
                </button>
              </>
            )}
            <button
              type="button"
              className="ej-btn ej-danger ej-size-sm"
              onClick={closeGallery}
              data-autofocus
            >
              Cerrar
            </button>
          </>
        }
      >
        {selectedImageIndex !== null && images.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                background: "#f8fafc",
                boxShadow: "inset 0 0 0 1px #eef2f7",
              }}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`Imagen ampliada ${selectedImageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  maxHeight: "65vh",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Miniaturas opcionales */}
            {images.length > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(64px, 1fr))",
                  gap: 8,
                }}
              >
                {images.map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className="ej-btn ej-size-xs"
                    style={{
                      padding: 0,
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow:
                        idx === selectedImageIndex
                          ? "0 0 0 2px #eab5c5"
                          : "inset 0 0 0 1px #e5e7eb",
                    }}
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <img
                      src={thumb}
                      alt={`Miniatura ${idx + 1}`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 64,
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </EJModal>
    </div>
  );
};

export default ReviewItem;
