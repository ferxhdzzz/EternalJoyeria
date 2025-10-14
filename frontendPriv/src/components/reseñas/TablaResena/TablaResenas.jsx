import React from "react";
import Swal from "sweetalert2";
// ✅ Usamos el alias 'ResenaCard' como en master, es más descriptivo para el nuevo diseño.
import ResenaCard from "../row/ResenaRow"; 
import "./TablaResenas.css";
// ✅ Mantenemos la importación de tus botones, ya que el componente hijo los necesitará.
import "../../../styles/shared/buttons.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  // ✅ LÓGICA MEJORADA: Se usa SweetAlert2 directamente para la confirmación.
  const handleEliminarClick = async (review) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar la reseña de ${
        review.nombre || review.id_customer?.firstName || "este cliente"
      }. ¡Esta acción es irreversible!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d6336c",
      cancelButtonColor: "#96a2afff",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteReviews(review._id);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado correctamente!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error.message || "No se pudo eliminar la reseña.",
        });
      }
    }
  };

  // ✅ MEJORA FUNCIONAL: Ordena las reseñas para mostrar las más recientes primero.
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // ✅ DISEÑO CORREGIDO: Usamos la estructura de divs y CSS Grid de master.
  return (
    <div className="tabla-resenas-wrapper">
      <div className="reviews-card-list-container">
        <h2>{titulo}</h2>
        {sortedReviews.length > 0 ? (
          <div className="reviews-grid">
            {sortedReviews.map((review) => (
              <ResenaCard
                key={review._id}
                {...review}
                // Pasamos una sola función 'onClick' a la tarjeta.
                onClick={() => handleEliminarClick(review)}
              />
            ))}
          </div>
        ) : (
          <div className="no-reviews-message">
            <p>No hay reseñas disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaResenas;