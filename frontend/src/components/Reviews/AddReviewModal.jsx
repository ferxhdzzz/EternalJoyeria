import React, { useState } from 'react';

// Modal para agregar nuevas reseñas
const AddReviewModal = ({ isOpen, onClose, onSubmit, productName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Por favor escribe un comentario';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    }
    
    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        comment: comment.trim()
      });
      
      // Limpiar formulario
      setRating(0);
      setComment('');
      setErrors({});
    } catch (error) {
      console.error('Error enviando reseña:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment('');
      setErrors({});
      onClose();
    }
  };

  // Manejar cambio de calificación
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // Manejar cambio de comentario
  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Escribir reseña</h3>
          <button className="modal-close" onClick={handleClose} disabled={isSubmitting}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="product-info">
            <h4>Reseña para: {productName}</h4>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            {/* Calificación */}
            <div className="form-group">
              <label className="form-label">Tu calificación *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(star)}
                    disabled={isSubmitting}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= rating ? "#FFD700" : "#E0E0E0"}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>
              {errors.rating && <span className="error-message">{errors.rating}</span>}
              {rating > 0 && (
                <div className="rating-text">
                  {rating === 1 && 'Muy malo'}
                  {rating === 2 && 'Malo'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bueno'}
                  {rating === 5 && 'Excelente'}
                </div>
              )}
            </div>

            {/* Comentario */}
            <div className="form-group">
              <label className="form-label">Tu comentario *</label>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                className={`form-textarea ${errors.comment ? 'error' : ''}`}
                placeholder="Comparte tu experiencia con este producto..."
                rows="5"
                disabled={isSubmitting}
              />
              {errors.comment && <span className="error-message">{errors.comment}</span>}
              <div className="char-count">
                {comment.length}/500 caracteres
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" required disabled={isSubmitting} />
                <span className="checkmark"></span>
                Acepto que mi reseña sea visible públicamente y cumpla con las políticas de la tienda
              </label>
            </div>

            {/* Botones de acción */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Enviando...
                  </>
                ) : (
                  'Publicar reseña'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal; 