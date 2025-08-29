import React, { useState } from 'react';
import  "./ReviewList.css";


const ReviewItem = ({ review }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openGallery = (index) => setSelectedImageIndex(index);
  const closeGallery = () => setSelectedImageIndex(null);

  const handleNext = () => {
    if (review.images && selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === review.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (review.images && selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? review.images.length - 1 : prevIndex - 1
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rank) => {
    if (!rank || rank < 1) return <span className="no-rating">Sin calificación</span>;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rank ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const userName = review.id_customer?.firstName || 'Anónimo';
  const productName = review.id_product?.name || 'Producto desconocido';
  const productImage = review.id_product?.images?.[0] || 'https://placehold.co/150x150';

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
                {review.comment?.trim() || "Sin comentario"}
              </p>
              <p className="user-name">Por: {userName}</p>
            </div>
            <div className="review-rating">
              {renderStars(review.rank)}
            </div>
            <p className="order-date">{formatDate(review.createdAt)}</p>
          </div>

          {/* Sección de imágenes adjuntas */}
          {Array.isArray(review.images) && review.images.length > 0 && (
            <div className="review-images-section">
              <p className="review-images-label">Imágenes adjuntas:</p>
              <div className="review-images">
                {review.images.map((img, index) => (
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

      {/* Modal de galería */}
      {selectedImageIndex !== null && Array.isArray(review.images) && (
        <div className="gallery-modal-overlay" onClick={closeGallery}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeGallery}>&times;</span>
            <img
              src={review.images[selectedImageIndex]}
              alt={`Imagen ampliada ${selectedImageIndex + 1}`}
              className="expanded-image"
            />
            {review.images.length > 1 && (
              <>
                <button className="prev-btn" onClick={handlePrev}>❮</button>
                <button className="next-btn" onClick={handleNext}>❯</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
