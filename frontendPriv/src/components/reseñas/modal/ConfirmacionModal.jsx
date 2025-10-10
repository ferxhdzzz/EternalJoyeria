import React from "react"; // Ya no necesitamos useState, ya que la lógica de selección se mueve a Swal
import ResenaRow from "../row/ResenaRow";
// import ConfirmacionModal from "../modal/ConfirmacionModal"; // <-- ¡ELIMINADO!
import Swal from "sweetalert2";
import "./TablaResenas.css";

// El componente ya no necesita 'reviews' ni 'deleteReviews' como parámetros si no los usas directamente en el render,
// pero los mantendré ya que son necesarios para la lógica de eliminación.
const TablaResenas = ({ titulo, reviews = [], deleteReviews }) => {
  // const [resenaSeleccionada, setResenaSeleccionada] = useState(null); // <-- ¡ELIMINADO!

  // --- Lógica de Eliminación con SweetAlert2 ---
  const handleEliminarClick = async (review) => {
    // 1. Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar la reseña de ${review.nombre}. ¡Esta acción es irreversible!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    // 2. Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        // Llamar a la función de eliminación
        await deleteReviews(review._id);

        // 3. Alerta de éxito después de la eliminación
        Swal.fire({
          icon: "success",
          title: "¡Eliminado correctamente!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error) {
        // 4. Alerta de error si falla la eliminación
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error.message || "No se pudo eliminar la reseña.",
        });
      }
    }
  };

  // Las funciones confirmarEliminacion y cancelarEliminacion ya no son necesarias.

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
                <th>Compra</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ResenaRow
                    key={review._id}
                    {...review}
                    // La función onClick llama directamente a handleEliminarClick
                    onClick={() => handleEliminarClick(review)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay reseñas disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ELIMINAMOS el renderizado condicional del modal personalizado */}
      {/* {resenaSeleccionada && (
        <ConfirmacionModal
          mensaje="¿Está seguro de eliminar esta reseña?"
          onConfirmar={confirmarEliminacion}
          onCancelar={cancelarEliminacion}
        />
      )} */}
    </div>
  );
};

export default TablaResenas;