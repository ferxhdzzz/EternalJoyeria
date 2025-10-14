// hooks/Productos/UseActionProduct.jsx
import axios from "axios";
import toast from "react-hot-toast";

const useProductActions = (getProducts) => {
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://eternaljoyeria-cg5d.onrender.com/api/products/${id}`, {
        withCredentials: true, // ← incluir cookies de sesión
      });
      toast.success("Producto eliminado correctamente");
      getProducts();
    } catch (error) {
      toast.error("Error al eliminar el producto");
      console.error("Error al eliminar:", error);
    }
  };

  return {
    deleteProduct,
  };
};

export default useProductActions;
