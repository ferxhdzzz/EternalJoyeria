// src/components/AddReviewModal.js (Archivo Corregido)

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { usePurchaseVerification } from '../../hooks/usePurchaseVerification'; // <<<< 1. Importar el nuevo hook
import '../../styles/AddReviewModal.css';

const AddReviewModal = ({ isOpen, onClose, onSubmit, productName, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const { user } = useAuth();
  const { hasUserPurchasedProduct } = usePurchaseVerification(); // <<<< 2. Usar el hook de verificación

  const handleClose = () => {
    setRating(0);
    setComment('');
    setErrors({});
    setImages([]);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Por favor selecciona una calificación.';
    if (!comment.trim()) newErrors.comment = 'Por favor escribe un comentario.';
    else if (comment.trim().length < 10) newErrors.comment = 'El comentario debe tener al menos 10 caracteres.';
    return newErrors;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      Swal.fire({
        title: 'Límite de imágenes',
        text: 'Solo puedes subir un máximo de 5 imágenes por reseña.',
        icon: 'warning',
        confirmButtonColor: '#eab5c5'
      });
      return;
    }
    
    // Aseguramos que solo guardamos el objeto File y que la previsualización se maneje correctamente
    setImages(prevImages => {
      const newImages = [...prevImages, ...files.slice(0, 5 - prevImages.length)];
      return newImages;
    });
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'No estás autenticado',
        text: 'Debes iniciar sesión para publicar una reseña.',
        icon: 'warning',
        confirmButtonColor: '#eab5c5'
      });
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // <<<< 3. VALIDACIÓN CRUCIAL DE COMPRA ANTES DE ENVIAR
      const hasPurchased = await hasUserPurchasedProduct(productId);
        
      if (!hasPurchased) {
        Swal.fire({
          title: '¡Espera un momento! 🧐',
          text: `Parece que aún no has comprado ${productName}. Solo los clientes verificados pueden dejar una reseña.`,
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#D1A6B4'
        });
        setIsSubmitting(false); // Detenemos la carga y salimos
        return;
      }
      // <<<< FIN DE VALIDACIÓN DE COMPRA

      const formData = new FormData();
      formData.append("id_customer", user._id);
      formData.append("id_product", productId);
      formData.append("rank", rating);
      formData.append("comment", comment);

      // Agregar archivos (File objects) al formData
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/reviews", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al enviar la reseña.");
      }

      const reviewData = await res.json();

      Swal.fire({
        title: '¡Reseña publicada!',
        text: 'Gracias por compartir tu opinión.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      });

      onSubmit(reviewData);
      handleClose();

    } catch (error) {
      console.error('Error enviando reseña:', error);
      setErrors({ general: 'Hubo un error al publicar tu reseña. Inténtalo de nuevo.' });
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#eab5c5'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (errors.rating) setErrors(prev => ({ ...prev, rating: '' }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) setErrors(prev => ({ ...prev, comment: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
          <h4>Reseña para: {productName}</h4>

          <form onSubmit={handleSubmit} className="review-form">
            {errors.general && <span className="error-message">{errors.general}</span>}

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
              <div className="char-count">{comment.length}/500 caracteres</div>
            </div>

            {/* Subida de imágenes */}
            <div className="form-group">
              <label className="form-label">Subir imágenes (opcional, máximo 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-control-file"
                onChange={handleImageUpload}
                disabled={isSubmitting || images.length >= 5}
              />
              <div className="image-preview-container">
                {images.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleClose} disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className="btn-submit" disabled={isSubmitting || rating === 0 || !comment.trim()}>
                {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;