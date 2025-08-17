import React, { useState } from 'react';

// Componente para mostrar una reseña individual
const ReviewItem = ({ review, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Manejar eliminación de reseña
  const handleDelete = () => {
    onDelete(review.id);
    setShowDeleteConfirm(false);
  };

  // Manejar edición de reseña
  const handleEdit = () => {
    // TODO: Implementar edición con backend
    console.log('Editando reseña:', review.id, editedComment);
    setIsEditing(false);
  };

  // Verificar si es la reseña del usuario actual
  const isCurrentUserReview = review.userId === 'currentUser';

  return (
    <div className="review-item">
      {/* Encabezado de la reseña */}
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div className="reviewer-details">
            <h5 className="reviewer-name">{review.userName}</h5>
            <div className="review-meta">
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= review.rating ? "#FFD700" : "#E0E0E0"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="review-date">{formatDate(review.date)}</span>
              {review.verified && (
                <span className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#28a745"/>
                  </svg>
                  Compra verificada
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones de la reseña (solo para el usuario actual) */}
        {isCurrentUserReview && (
          <div className="review-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              </svg>
              Editar
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
              </svg>
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Contenido de la reseña */}
      <div className="review-content">
        {isEditing ? (
          <div className="edit-review-form">
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="edit-comment-input"
              rows="4"
              placeholder="Escribe tu reseña..."
            />
            <div className="edit-actions">
              <button 
                className="btn-save"
                onClick={handleEdit}
              >
                Guardar
              </button>
              <button 
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  setEditedComment(review.comment);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="review-comment">{review.comment}</p>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h4>¿Eliminar reseña?</h4>
            <p>Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar tu reseña?</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-delete"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem; 