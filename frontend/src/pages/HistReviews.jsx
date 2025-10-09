import React, { useState } from 'react';
import  "./ReviewList.css";


const ReviewItem = ({ review }) => {
  // 1. CLAVE: Verificación de review principal
  if (!review) {
    return null; 
  }
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openGallery = (index) => setSelectedImageIndex(index);
  const closeGallery = () => setSelectedImageIndex(null);

  // --- Handlers de Galería ---
  // Aseguramos que review.images sea un array vacío si es null o undefined.
  const reviewImages = Array.isArray(review.images) ? review.images : [];

  const handleNext = () => {
    if (reviewImages.length > 0 && selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === reviewImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (reviewImages.length > 0 && selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? reviewImages.length - 1 : prevIndex - 1
      );
    }
  };
  // --- Fin Handlers ---

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const renderStars = (rank) => {
    const safeRank = Number(rank) || 0;
    if (safeRank < 1) return <span className="no-rating">Sin calificación</span>;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= safeRank ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // 2. CLAVE: Corregimos cómo se accede a id_product, id_customer e images
  // Si review.id_product es null/undefined, todo lo que sigue después de él es nulo de forma segura.
  const userName = review.id_customer?.firstName || 'Anónimo';
  
  // **Esta es la línea que fallaba si id_product era null**
  const productName = review.id_product?.name || 'Producto desconocido';
  
  // Usamos encadenamiento opcional en cada nivel.
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
          {reviewImages.length > 0 && (
            <div className="review-images-section">
              <p className="review-images-label">Imágenes adjuntas:</p>
              <div className="review-images">
                {reviewImages.map((img, index) => (
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
      {selectedImageIndex !== null && reviewImages.length > 0 && (
        <div className="gallery-modal-overlay" onClick={closeGallery}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeGallery}>&times;</span>
            <img
              src={reviewImages[selectedImageIndex]}
              alt={`Imagen ampliada ${selectedImageIndex + 1}`}
              className="expanded-image"
            />
            {reviewImages.length > 1 && (
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
