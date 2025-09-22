// frontend/src/components/Reviews/AddReviewModal.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import '../../styles/shared/buttons.css';
import '../../styles/shared/modal.css';
import EJModal from '../../components/ui/EJModal.jsx';
import '../../styles/AddReviewModal.css'; // Mantén estilos internos (rating, previews). Quita overlay/card antiguos.

const AddReviewModal = ({ isOpen, onClose, onSubmit, productName, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const { user } = useAuth();

  const handleClose = () => {
    setRating(0);
    setComment('');
    setErrors({});
    setImages([]);
    onClose();
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
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, file]);
      reader.readAsDataURL(file);
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
      const formData = new FormData();
      formData.append("id_customer", user.id);
      formData.append("id_product", productId);
      formData.append("rank", rating);
      formData.append("comment", comment);

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

  return (
    <EJModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Escribir reseña"
      footer={
        <>
          <button type="button" className="ej-btn ej-danger ej-size-sm" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button form="add-review-form" type="submit" className="ej-btn ej-approve ej-size-sm" data-autofocus
            disabled={isSubmitting || rating === 0 || !comment.trim()}>
            {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </>
      }
    >
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Reseña para: {productName}</h4>
      <form id="add-review-form" onSubmit={handleSubmit} className="review-form">
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
                aria-label={`Calificación ${star}`}
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
            data-autofocus
          />
          {errors.comment && <span className="error-message">{errors.comment}</span>}
          <div className="char-count">{comment.length}/500 caracteres</div>
        </div>

        {/* Subida de imágenes */}
        <div className="form-group">
          <label className="form-label">Subir imágenes (opcional, máximo 5)</label>

          <input
            id="reviewImages"
            type="file"
            accept="image/*"
            multiple
            className="file-input-hidden"
            onChange={handleImageUpload}
            disabled={isSubmitting || images.length >= 5}
          />
          <label htmlFor="reviewImages" className="ej-btn ej-danger ej-size-sm ej-w-140" style={{ marginBottom: 8 }}>
            Agregar fotos
          </label>

          <div className="image-preview-container">
            {images.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} className="preview-image" />
                <button
                  type="button"
                  className="remove-image-btn ej-btn ej-danger ej-size-xs"
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                  aria-label="Eliminar imagen"
                  title="Eliminar imagen"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </EJModal>
  );
};

export default AddReviewModal;
