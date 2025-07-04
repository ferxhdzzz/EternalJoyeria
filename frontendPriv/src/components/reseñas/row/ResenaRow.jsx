import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";

const ResenaRow = ({ nombre, calificacion, comentario, email, compra, onEliminar }) => {
  return (
    <tr className="resena-row">
      <td>{nombre}</td>
      <td>{calificacion}</td>
      <td>{comentario}</td>
      <td>{email}</td>
      <td>{compra}</td>
      <td><EliminarButton onClick={onEliminar} /></td>
    </tr>
  );
};

export default ResenaRow;
