import React, { useState } from "react";
import ResenaRow from "../row/ResenaRow";
import ConfirmacionModal from "../modal/ConfirmacionModal";
import "./TablaResenas.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

  const handleEliminarClick = (review) => {
    setResenaSeleccionada(review);
  };

  const confirmarEliminacion = () => {
    deleteReviews(resenaSeleccionada._id);
    setResenaSeleccionada(null);
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

      {/* Modal de confirmación */}
      {resenaSeleccionada && (
        <ConfirmacionModal
          mensaje="¿Esta segura de eliminar esta reseña?"
          onConfirmar={confirmarEliminacion}
          onCancelar={cancelarEliminacion}
        />
      )}
    </div>
  );
};

export default TablaResenas;
