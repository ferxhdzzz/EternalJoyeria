import React from 'react';
import ReviewItem from './ReviewItem';

// Componente para mostrar la lista de reseñas
const ReviewList = ({ reviews, isLoading, onDeleteReview }) => {
  if (isLoading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="reviews-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E0E0E0"/>
        </svg>
        <h4>No hay reseñas aún</h4>
        <p>¡Sé el primero en compartir tu experiencia con este producto!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h4>Todas las reseñas ({reviews.length})</h4>
        <div className="review-filters">
          <select className="filter-select">
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
          </select>
        </div>
      </div>

      <div className="reviews-container">
        {reviews.map(review => (
          <ReviewItem 
            key={review.id}
            review={review}
            onDelete={onDeleteReview}
          />
        ))}
                                                </div>

                  {/* Paginación (para cuando haya muchas reseñas) */}
                  {reviews.length > 10 && (
                    <div className="reviews-pagination">
                      <button className="pagination-btn" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
                        </svg>
                        Anterior
                      </button>
                      <div className="pagination-numbers">
                        <span className="page-number active">1</span>
                        <span className="page-number">2</span>
                        <span className="page-number">3</span>
                      </div>
                      <button className="pagination-btn">
                        Siguiente
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            };

export default ReviewList; 