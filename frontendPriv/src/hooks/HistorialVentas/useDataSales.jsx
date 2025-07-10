// useDataSales.js
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const useDataSales = (methods) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const getSaleById = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/sales/${id}`);
      if (!response.ok) throw new Error("Error al obtener venta por ID");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener venta:", error);
      toast.error("Error al obtener venta");
      return null;
    }
  };

  const editSale = async (dataForm) => {
    try {
      const cleanedData = {
        status: dataForm.status || "",
      };

      const response = await fetch(`http://localhost:4000/api/sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) throw new Error("Error al actualizar venta");

      toast.success("Estado de venta actualizado exitosamente");
      navigate("/historial-compras");
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      toast.error("Error al actualizar venta");
    } finally {
      reset();
    }
  };

  const handleSaleAction = (dataForm) => {
    editSale(dataForm);
  };

  const loadSale = async () => {
    if (id) {
      const sale = await getSaleById(id);
      if (sale) {
        reset({
          status: sale?.idOrder?.status || "",
        });
      }
    }
  };

  useEffect(() => {
    loadSale();
  }, [id]);

  return {
    register,
    handleSubmit: handleSubmit(handleSaleAction),
    errors,
  };
};

export default useDataSales;