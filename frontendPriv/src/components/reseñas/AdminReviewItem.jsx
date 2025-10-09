import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './Review.css'; // Usamos los mismos estilos

const AdminReviewItem = ({ review, onDelete }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    // Agregamos hora y minuto para el Admin
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Función para renderizar las estrellas
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

  // Función para manejar la eliminación de la reseña
  const handleDelete = () => {
    Swal.fire({
      title: '¿Deseas eliminar esta reseña?',
      text: `Se eliminará la reseña de ${review.id_customer?.firstName || 'Usuario Desconocido'} sobre el producto ${review.id_product?.name || 'Desconocido'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c8d', 
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // onDelete viene del hook useResenaAction, que ya maneja la recarga.
        await onDelete(review._id); 
        
        // El Swal de éxito se maneja mejor en el hook que hace la petición.
        // Si no usas el hook que tiene el Swal.fire, descomenta el siguiente bloque:
        /*
        Swal.fire({
          title: 'Eliminada',
          text: 'La reseña ha sido eliminada',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        */
      }
    });
  };

  // Acceso seguro a las propiedades (MANTENEMOS TU CORRECCIÓN)
  const productName = review.id_product?.name || 'Producto Desconocido';
  const productImageUrl = review.id_product?.images?.[0] || 'https://placehold.co/150x150';
  const customerName = `${review.id_customer?.firstName || 'Usuario'} ${review.id_customer?.lastName || 'Desconocido'}`;

  return (
    <div className="historial-item-content">
      <div className="historial-item-image-container">
        <img
          src={productImageUrl} 
          alt={productName} 
          className="historial-item-image"
        />
      </div>
      <div className="historial-item-details">
        <div className="product-info" style={{ position: 'relative' }}>
          {/* Agregamos el nombre del cliente para el Admin */}
          <p className="customer-name-admin">
            Reseña de: <strong>{customerName}</strong>
          </p>
          <h3 className="product-name">{productName}</h3>
          
          {/* Botón de eliminar */}
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
            <p className="order-date">Fecha: {formatDate(review.createdAt)}</p>
          </div>
          
          {/* Imágenes adjuntas */}
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

export default AdminReviewItem;