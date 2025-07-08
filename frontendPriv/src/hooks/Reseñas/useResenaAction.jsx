import { toast } from "react-hot-toast";
 const api = "http://localhost:4000/api/reviews";

const useReviewAction = (getReviews) => {
 
  //funcion para eliminar un usuario por su id
  // se usa async/await para manejar la asincronía de la llamada a la API
  const deleteReviews = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        method: "DELETE",
      });
      toast.success("review deleted successfully");
      console.log("review deleted:", response);
      getReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
        getReviews();
    }
  };
 
  // Función para manejar la actualización de un usuario
  // Esta función se llama cuando se hace clic en el botón de editar
  // y redirige al usuario a la página de edición del usuario
  // pasando el id del usuario como parámetro en la URL
 
 
  return {
    deleteReviews,
  };
};
 
export default useReviewAction;