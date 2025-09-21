// src/components/reseñas/row/ResenaRow.jsx
import React from "react";
import "./ResenaRow.css";
import "../../../styles/shared/buttons.css";

/**
 * Fila de reseña adaptada:
 * - Mantiene la API anterior (onClick para eliminar).
 * - Muestra Nombre / Calificación / Comentario / Compra con fallbacks
 *   para distintos shapes de datos que pueda enviar el backend.
 */
const ResenaRow = ({
  id_customer,
  rank,
  comment,
  id_product,
  onClick,

  // Fallbacks opcionales por si el backend cambia nombres
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
  // Nombre (preferencia: objeto con first/last -> string -> name)
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

  // Calificación (rank/rating/score/stars)
  const calificacion =
    rank ?? rating ?? score ?? stars ?? "—";

  // Compra / Producto (preferencia: nombre de producto; si no, id de orden/compra)
  const compra =
    (typeof id_product === "object" && (id_product?.name || id_product?.title)) ||
    (typeof product === "object" && (product?.name || product?.title)) ||
    (typeof productId === "object" && (productId?.name || productId?.title)) ||
    (typeof id_product === "string" && id_product) ||
    purchaseId ||
    orderId ||
    (typeof idOrder === "object" ? (idOrder?.code || idOrder?._id) : idOrder) ||
    "—";

  return (
    <tr className="resena-row">
      <td>{nombre || "—"}</td>
      <td>{calificacion !== undefined && calificacion !== null ? String(calificacion) : "—"}</td>
      <td>{comment ? String(comment) : "—"}</td>
      <td>{typeof compra === "string" ? compra : String(compra || "—")}</td>
      <td>
        {/* Botón unificado pastel (rosa claro) para eliminar */}
        <button
          type="button"
          className="ej-btn ej-danger ej-size-sm"
          onClick={onClick}
          title="Eliminar reseña"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default ResenaRow;
