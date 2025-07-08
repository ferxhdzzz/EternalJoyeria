import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";

const ResenaRow = ({ id_customer, rank, comment, onClick }) => {
  const nombre = typeof id_customer === "object"
    ? `${id_customer?.firstName || ""} ${id_customer?.lastName || ""}`
    : id_customer;

  return (
    <tr className="resena-row">
      <td>{nombre}</td>
      <td>{rank}</td>
      <td>{comment}</td>
      <td>
        <EliminarButton onClick={onClick} confirmar /> {/* <--- solo aquí confirmás */}
      </td>
    </tr>
  );
};

export default ResenaRow;
