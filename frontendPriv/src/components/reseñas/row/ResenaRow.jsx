import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";

const ResenaRow = ({ id_customer, rank, comment, id_product, onClick }) => {
  const nombre = typeof id_customer === "object"
    ? `${id_customer?.firstName || ""} ${id_customer?.lastName || ""}`
    : String(id_customer);

  const compra = typeof id_product === "object"
    ? `${id_product?.name || ""}`
    : String(id_product);

  return (
    <tr className="resena-row">
      <td>{nombre}</td>
      <td>{String(rank)}</td>
      <td>{String(comment)}</td>
      <td>{compra}</td>
      <td>
        <EliminarButton onClick={onClick} confirmar />
      </td>
    </tr>
  );
};

export default ResenaRow;