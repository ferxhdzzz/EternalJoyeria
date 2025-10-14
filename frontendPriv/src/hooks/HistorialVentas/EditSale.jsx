// src/hooks/HistorialVentas/EditSale.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "../../styles/EditSales.css";

const EditSale = ({ saleId, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/${saleId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar la venta");

        const data = await res.json();
        const status = data?.idOrder?.status || "pendiente";
        setValue("status", status);
      } catch (error) {
        console.error("ERROR AL CARGAR VENTA", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la venta",
          confirmButtonColor: "#d6336c",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [saleId, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/${saleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: data.status }),
      });
      if (!response.ok) throw new Error("Error al actualizar la venta");

      await Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Estado de la venta actualizado correctamente",
        confirmButtonColor: "#d6336c",
      });

      if (onSave) await onSave();
      onClose();
    } catch (error) {
      console.error("ERROR AL ACTUALIZAR VENTA", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el estado de la venta",
        confirmButtonColor: "#d6336c",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="edit-sale-modal">Cargando venta...</p>;

  return (
    <div className="edit-sale-modal">
      <form onSubmit={handleSubmit(onSubmit)} className="edit-sale-form">
        <label htmlFor="status">Estado de la venta:</label>
        <select
          id="status"
          {...register("status", { required: "Este campo es obligatorio" })}
          disabled={submitting}
        >
          <option value="">Seleccione un estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="En camino">En camino</option>
          <option value="Entregado">Entregado</option>
        </select>
        {errors.status && <p className="error-message">{errors.status.message}</p>}

        <div className="edit-sale-buttons">
          <button type="submit" className="ej-btn ej-approve" disabled={submitting}>
            {submitting ? "Actualizando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ej-btn ej-danger"
            disabled={submitting}
          >
            Cancelar
          </button>
          {/* ✅ ELIMINADO: Se quitó el botón 'Guardar' duplicado */}
        </div>
      </form>
    </div>
  );
};

export default EditSale;