import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './Review.css';

const ReviewItem = ({ review, onDelete }) => {
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

  const handleDelete = () => {
    Swal.fire({
      title: '¿Deseas eliminar esta reseña?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c8d', // rosita
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(review._id);
        Swal.fire({
          title: 'Eliminada',
          text: 'La reseña ha sido eliminada',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="historial-item-content">
      <div className="historial-item-image-container">
        <img
          src={review.id_product.images?.[0] || 'https://placehold.co/150x150'}
          alt={review.id_product.name}
          className="historial-item-image"
        />
      </div>
      <div className="historial-item-details">
        <div className="product-info" style={{ position: 'relative' }}>
          <h3 className="product-name">{review.id_product.name}</h3>
          {/* Botón de eliminar en esquina superior derecha */}
          <FaTrash
            onClick={handleDelete}
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
                  <img
                    key={index}
                    src={img}
                    alt={`Reseña ${index + 1}`}
                    className="review-image"
                  />
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