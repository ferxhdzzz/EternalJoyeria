import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import "../../styles/shared/buttons.css";
import "../../styles/shared/modal.css";
import "../../styles/shared/AddReviewModal.css";
import EJModal from "../ui/EJModal.jsx";

const API =
  (import.meta.env.VITE_API_URL || "https://eternaljoyeria-cg5d.onrender.com/api").replace(/\/$/, "");

const AddReviewModal = ({ isOpen, onClose, onSubmit, productName, productId }) => {
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]); // [{ file, url }]
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chars = comment.trim().length;
  const charInfo = useMemo(() => `${chars}/500`, [chars]);

  const handleClose = () => {
    images.forEach((it) => it?.url && URL.revokeObjectURL(it.url));
    setRating(0);
    setComment("");
    setErrors({});
    setImages([]);
    onClose?.();
  };

  const validateForm = () => {
    const e = {};
    if (!rating || rating < 1) e.rating = "Por favor selecciona una calificación.";
    if (chars < 10) e.comment = "El comentario debe tener al menos 10 caracteres.";
    if (chars > 500) e.comment = "El comentario no puede exceder 500 caracteres.";
    if (images.length > 5) e.images = "Máximo 5 imágenes.";
    return e;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = Math.max(0, 5 - images.length);
    const willTake = files.slice(0, remaining);

    if (files.length > remaining) {
      Swal.fire({
        title: "Límite de imágenes",
        text: "Solo puedes subir un máximo de 5 imágenes por reseña.",
        icon: "warning",
        confirmButtonColor: "#eab5c5",
      });
    }

    const next = willTake.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: "No estás autenticado",
        text: "Debes iniciar sesión para publicar una reseña.",
        icon: "warning",
        confirmButtonColor: "#eab5c5",
      });
      return;
    }

    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("id_customer", user.id);
      fd.append("id_product", productId);
      fd.append("rank", String(rating));
      fd.append("comment", comment.trim());
      images.forEach(({ file }) => fd.append("images", file));

      const res = await fetch(`${API}/reviews`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Error al enviar la reseña.");
      }

      const data = await res.json().catch(() => ({}));
      Swal.fire({
        title: "¡Reseña publicada!",
        text: "Gracias por compartir tu opinión.",
        icon: "success",
        confirmButtonColor: "#eab5c5",
      });

      onSubmit?.(data);
      handleClose();
    } catch (error) {
      console.error("Error enviando reseña:", error);
      setErrors({ general: error.message || "Hubo un error al publicar tu reseña." });
      Swal.fire({
        title: "Error",
        text: error.message || "Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#eab5c5",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (n) => {
    setRating(n);
    if (errors.rating) setErrors((p) => ({ ...p, rating: undefined }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) setErrors((p) => ({ ...p, comment: undefined }));
  };

  return (
    <EJModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Escribir reseña"
      footer={
        <div className="review-footer-actions">
          <button
            type="button"
            className="btn-rose-outline btn-equal"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            form="add-review-form"
            type="submit"
            className="btn-rose-solid btn-equal"
            data-autofocus
            disabled={isSubmitting || !rating || chars < 10 || chars > 500}
          >
            {isSubmitting ? "Enviando..." : "Publicar reseña"}
          </button>
        </div>
      }
    >
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Reseña para: {productName}</h4>

      <form id="add-review-form" onSubmit={handleSubmit} className="review-form">
        {errors.general && <span className="error-message">{errors.general}</span>}

        {/* Calificación */}
        <div className="form-group">
          <label className="form-label">Tu calificación *</label>
          <div className="rating-input" role="radiogroup" aria-label="Calificación">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= rating ? "active" : ""}`}
                onClick={() => handleRatingChange(star)}
                disabled={isSubmitting}
                aria-checked={star <= rating}
                role="radio"
                aria-label={`Calificación ${star}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") handleRatingChange(star);
                  if (ev.key === "ArrowRight") handleRatingChange(Math.min(5, rating + 1));
                  if (ev.key === "ArrowLeft") handleRatingChange(Math.max(1, rating - 1));
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= rating ? "#FFD700" : "#E0E0E0"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
            maxLength={500}
            className={`form-textarea ${errors.comment ? "error" : ""}`}
            placeholder="Comparte tu experiencia con este producto..."
            rows={5}
            disabled={isSubmitting}
            data-autofocus
          />
          {errors.comment && <span className="error-message">{errors.comment}</span>}
          <div className="char-count">{charInfo}</div>
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
          {/* Outline como "Ver detalles completos" y texto rosa */}
          <label htmlFor="reviewImages" className="btn-rose-outline btn-block" style={{ marginBottom: 8 }}>
            Agregar fotos
          </label>
          {errors.images && <span className="error-message">{errors.images}</span>}

          <div className="image-preview-container">
            {images.map((img, index) => (
              <div key={img.url || index} className="image-preview">
                <img src={img.url} alt={`Preview ${index + 1}`} className="preview-image" />
                <button
                  type="button"
                  className="remove-image-btn"
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
