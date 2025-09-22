// frontendPriv/src/components/reseñas/row/ResenaRow.jsx
import React from "react";
import "./ResenaRow.css";
import "../../../styles/Shared/buttons.css"; 

/**
 * Fila de reseña:
 * - Usa onDeleteClick (y soporta onClick como fallback por compatibilidad).
 * - Muestra Nombre / Calificación / Comentario / Compra con fallbacks.
 */
const ResenaRow = ({
  id_customer,
  rank,
  comment,
  id_product,
  onDeleteClick,      // <-- nombre correcto
  onClick,            // fallback por si en algún sitio viejo aún usan onClick

  // Fallbacks opcionales
  name,
  user,
  customer,
  rating,
  score,
  stars,
  product,
  productId,
  orderId,
  purchaseId,
  idOrder,
}) => {
  const nombre =
    (typeof id_customer === "object" &&
      `${id_customer?.firstName || ""} ${id_customer?.lastName || ""}`.trim()) ||
    (typeof customer === "object" &&
      `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim()) ||
    (typeof user === "object" &&
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim()) ||
    (typeof id_customer === "string" && id_customer) ||
    name ||
    "—";

  const calificacion = rank ?? rating ?? score ?? stars ?? "—";

  const compra =
    (typeof id_product === "object" && (id_product?.name || id_product?.title)) ||
    (typeof product === "object" && (product?.name || product?.title)) ||
    (typeof productId === "object" && (productId?.name || productId?.title)) ||
    (typeof id_product === "string" && id_product) ||
    purchaseId ||
    orderId ||
    (typeof idOrder === "object" ? (idOrder?.code || idOrder?._id) : idOrder) ||
    "—";

  const handleDelete = onDeleteClick || onClick; // compat

  return (
    <tr className="resena-row">
      <td>{nombre || "—"}</td>
      <td>{calificacion !== undefined && calificacion !== null ? String(calificacion) : "—"}</td>
      <td>{comment ? String(comment) : "—"}</td>
      <td>{typeof compra === "string" ? compra : String(compra || "—")}</td>
      <td>
        <button
          type="button"
          className="ej-btn ej-danger ej-size-sm"
          onClick={handleDelete}
          title="Eliminar reseña"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default ResenaRow;
