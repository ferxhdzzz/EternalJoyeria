import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import "../../Styles/EditSales.css";

const EditSale = ({ saleId, onClose, onSave }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`http://localhost:4000/api/sales/${saleId}`);
        const data = await res.json();
        const status = data?.idOrder?.status || "pendiente";
        setValue("status", status);
      } catch (error) {
        console.error("Error al cargar venta", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [saleId, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:4000/api/sales/${saleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: data.status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la venta");
      }

      toast.success("Estado de la venta actualizado correctamente");

      // Esperar 1 segundo para que se vea la alerta antes de cerrar
      setTimeout(() => {
        if (onSave) onSave();
        onClose();
      }, 1000);

    } catch (error) {
      console.error("Error al actualizar venta", error);
      toast.error("Error al actualizar el estado de la venta");
    }
  };

  if (loading) return <p className="edit-sale-modal">Cargando venta...</p>;

  return (
    <div className="edit-sale-modal">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className="edit-sale-form">
        <label htmlFor="status">Estado de la venta:</label>
        <select id="status" {...register("status", { required: "Este campo es obligatorio" })}>
          <option value="">Seleccione un estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="No pagado">No pagado</option>
        </select>
        {errors.status && <p className="error-message">{errors.status.message}</p>}

        <div className="edit-sale-buttons">
          <button type="submit" className="btn-edit">Guardar</button>
          <button type="button" onClick={onClose} className="btn-delete">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditSale;
