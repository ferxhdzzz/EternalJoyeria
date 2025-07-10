import { toast } from "react-hot-toast";
const api = "http://localhost:4000/api/categories";

const useCategoriasAction = () => {
  const deleteCategorieById = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      toast.success("Categoría eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      toast.error("Error al eliminar la categoría");
    }
  };

  return { deleteCategorieById };
};

export default useCategoriasAction;