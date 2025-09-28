// IMPORTACIONES NECESARIAS
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "../../Styles/EditSales.css";

// COMPONENTE PRINCIPAL QUE RECIBE LAS PROPS
const EditSale = ({ saleId, onClose, onSave }) => {
  // HOOK DE REACT HOOK FORM PARA MANEJAR EL FORMULARIO
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // ESTADOS LOCALES PARA CONTROLAR CARGA Y ENVÍO
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // CARGA LOS DATOS DE LA VENTA CUANDO EL COMPONENTE SE MONTA
  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/${saleId}`, {
          credentials: "include", // INCLUYE COOKIES PARA AUTENTICACIÓN
        });
        if (!res.ok) throw new Error("Error al cargar la venta");

        const data = await res.json();
        const status = data?.idOrder?.status || "pendiente";

        // ESTABLECE EL VALOR DEL SELECT DE ESTADO
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

  // MANEJA EL ENVÍO DEL FORMULARIO
  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const response = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/${saleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: data.status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la venta");
      }

      // MUESTRA ALERTA DE ÉXITO
      await Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Estado de la venta actualizado correctamente",
        confirmButtonColor: "#d6336c",
      });

      // SI EXISTE FUNCIÓN onSave LA EJECUTA Y CIERRA MODAL
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

  // MUESTRA UN MENSAJE DE CARGA SI AÚN SE ESTÁ OBTENIENDO LA VENTA
  if (loading)
    return <p className="edit-sale-modal">Cargando venta...</p>;

  // RENDERIZA EL FORMULARIO PARA EDITAR EL ESTADO DE LA VENTA
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

        {errors.status && (
          <p className="error-message">{errors.status.message}</p>
        )}

        <div className="edit-sale-buttons">
          <button type="submit" className="btn-edit" disabled={submitting}>
            {submitting ? "Actualizando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-delete"
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

// EXPORTA EL COMPONENTE PARA SU USO
export default EditSale;
