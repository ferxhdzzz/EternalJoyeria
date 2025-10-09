import { toast } from "react-hot-toast";

const api = "https://eternaljoyeria-cg5d.onrender.com/api/reviews";

const useReviewAction = (getReviews) => {
  const deleteReviews = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        method: "DELETE",
        credentials: "include", // ← importante para rutas protegidas
      });

      if (!response.ok) throw new Error("Error al eliminar la review");

      toast.success("Review eliminada correctamente");
      console.log("Review eliminada:", response);
      getReviews();
    } catch (error) {
      console.error("Error al eliminar review:", error);
      toast.error("Error al eliminar review");
    } finally {
      getReviews();
    }
  };

  return {
    deleteReviews,
  };
};

export default useReviewAction;
