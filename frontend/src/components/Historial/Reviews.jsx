// src/components/Historial/Reviews.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './Review.css';

const ReviewItem = ({ review, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderStars = (rank) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`star ${i <= rank ? 'filled' : ''}`}>★</span>);
    }
    return stars;
  };

  // ✅ LÓGICA SIMPLIFICADA: El componente hijo ya no maneja la eliminación.
  // Solo notifica al padre cuando se hace clic en el botón.
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(review._id); // Llama a la función del padre con el ID de la reseña.
    }
  };

  const productName = review.id_product?.name || 'Producto Desconocido';
  const productImageUrl = review.id_product?.images?.[0] || 'https://placehold.co/150x150';

  return (
    <div className="historial-item-content">
      <div className="historial-item-image-container">
        <img src={productImageUrl} alt={productName} className="historial-item-image" />
      </div>
      <div className="historial-item-details">
        <div className="product-info" style={{ position: 'relative' }}>
          <h3 className="product-name">{productName}</h3>
          <FaTrash
            onClick={handleDeleteClick} // ✅ Se conecta a nuestra función simple
            className="delete-review-icon"
            title="Eliminar reseña"
          />
        </div>
        <div className="review-body-content">
          <div className="review-text-and-rating">
            <div className="review-comment-section">
              <p className="review-comment-text">{review.comment}</p>
            </div>
            <div className="review-rating">{renderStars(review.rank)}</div>
            <p className="order-date">{formatDate(review.createdAt)}</p>
          </div>
          {review.images && review.images.length > 0 && (
            <div className="review-images-section">
              <p className="review-images-label">Imágenes adjuntas:</p>
              <div className="review-images">
                {review.images.map((img, index) => (
                  <img key={index} src={img} alt={`Reseña ${index + 1}`} className="review-image" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;