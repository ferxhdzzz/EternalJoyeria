import React, { useState } from "react";
import ResenaRow from "../row/ResenaRow";
import ConfirmacionModal from "../modal/ConfirmacionModal";
import Swal from "sweetalert2";  // <--- importar Swal
import "./TablaResenas.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

  const handleEliminarClick = (review) => {
    setResenaSeleccionada(review);
  };

  const confirmarEliminacion = async () => {
    try {
      await deleteReviews(resenaSeleccionada._id);  // esperar a que termine la eliminación
      setResenaSeleccionada(null);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Eliminado correctamente!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (error) {
      // Opcional: alerta de error si la eliminación falla
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
    <div className="tabla-resenas-container">
      <h2>{titulo}</h2>
      <table className="tabla-resenas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Calificación</th>
            <th>Comentario</th>
            <th>Compra</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ResenaRow
                key={review._id}
                {...review}
                onClick={() => handleEliminarClick(review)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay reseñas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

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