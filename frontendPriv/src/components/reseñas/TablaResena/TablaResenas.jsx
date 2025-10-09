import React, { useState } from "react";
import ResenaRow from "../row/ResenaRow";
import ConfirmacionModal from "../../modal/ConfirmacionModal"; // Asumo la ruta
import Swal from "sweetalert2";
import "./TablaResenas.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

  const handleEliminarClick = (review) => {
    setResenaSeleccionada(review);
  };

  const confirmarEliminacion = async () => {
    try {
      // deleteReviews ya maneja la recarga de reseñas
      await deleteReviews(resenaSeleccionada._id); 
      setResenaSeleccionada(null);

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
  };

  const cancelarEliminacion = () => {
    setResenaSeleccionada(null);
  };

  return (
    <div className="tabla-resenas-wrapper">
      <div className="tabla-resenas-container">
        <h2>{titulo}</h2>
        <div className="tabla-scroll-wrapper">
          <table className="tabla-resenas">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Calificación</th>
                <th>Comentario</th>
                <th>Imágenes</th>
                <th>Producto</th> {/* Columna renombrada a Producto */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ResenaRow
                    key={review._id}
                    // Pasamos las propiedades individuales de la reseña
                    id_customer={review.id_customer}
                    rank={review.rank}
                    comment={review.comment}
                    id_product={review.id_product}
                    images={review.images}
                    onClick={() => handleEliminarClick(review)}
                  />
                ))
              ) : (
                <tr>
                  {/* colSpan corregido a 6 */}
                  <td colSpan="6">No hay reseñas disponibles.</td> 
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {resenaSeleccionada && (
        <ConfirmacionModal
          mensaje="¿Está seguro de eliminar esta reseña?"
          onConfirmar={confirmarEliminacion}
          onCancelar={cancelarEliminacion}
        />
      )}
    </div>
  );
};

export default TablaResenas;