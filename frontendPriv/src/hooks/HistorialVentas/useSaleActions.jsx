import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSaleActions = (getSales) => {
  const navigate = useNavigate();

  const deleteSale = async (id) => {
    // Confirmación antes de eliminar
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta venta?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/sales/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar venta");
      }
      toast.success("Venta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      toast.error("Error al eliminar venta");
    } finally {
      getSales();
    }
  };

  const handleUpdateSale = (id) => {
    navigate(`/historial-compras/${id}`);
  };

  return {
    deleteSale,
    handleUpdateSale,
  };
};

export default useSaleActions;
