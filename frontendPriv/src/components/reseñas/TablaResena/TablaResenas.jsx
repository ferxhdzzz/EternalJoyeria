import React from "react";
import Swal from "sweetalert2";
import ResenaCard from "../row/ResenaRow"; // ✅ Cambiado al nombre correcto del componente
import "./TablaResenas.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  // --- Lógica de Eliminación con SweetAlert2 ---
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

  // --- Lógica de Ordenamiento (reseñas más recientes primero) ---
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a._id < b._id) return 1;
    if (a._id > b._id) return -1;
    return 0;
  });

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
