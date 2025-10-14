import React from "react";
import EditButton from "../HistorialCompras/EditButton";
import "./HistoryRow.css";

const HistoryRow = ({ nombre, estado, direccion, email, compra, onEliminar, onEditar }) => {
  return (
    <tr className="historial-compras-row">
      <td>{nombre}</td>
      <td>{estado}</td>
      <td>{direccion}</td>
      <td>{email}</td>
      <td>{compra}</td>
      <td className="botones-cell">
        <EditButton onClick={onEditar} />
      </td>
    </tr>
  );
};

export default HistoryRow;
