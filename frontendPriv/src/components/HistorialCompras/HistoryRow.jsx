import React from "react";
import EliminarButton from "../HistorialCompras/EliminarButton";
import "./HistoryRow.css";

const HistoryRow = ({ nombre, estado, direccion, email, compra, onEliminar }) => {
  return (
    <tr className="historial-compras-row">
      <td>{nombre}</td>
      <td>{estado}</td>
      <td>{direccion}</td>
      <td>{email}</td>
      <td>{compra}</td>
      <td><EliminarButton onClick={onEliminar} /></td>
    </tr>
  );
};

export default HistoryRow;