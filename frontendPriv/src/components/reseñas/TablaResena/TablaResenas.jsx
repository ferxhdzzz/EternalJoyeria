import React from "react";
import Swal from "sweetalert2";
import ResenaCard from "../row/ResenaRow"; // ✅ Cambiado al nombre correcto del componente
import "./TablaResenas.css";
import "../../../styles/shared/buttons.css";

const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

  const confirmarEliminacion = async () => {
    try {
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
    }
  };

  const cancelarEliminacion = () => setResenaSeleccionada(null);

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
                <th>Compra</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((review) => (
                  <ResenaRow
                    key={review._id}
                    {...review}
                    onDeleteClick={() => setResenaSeleccionada(review)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay reseñas disponibles.</td>
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
