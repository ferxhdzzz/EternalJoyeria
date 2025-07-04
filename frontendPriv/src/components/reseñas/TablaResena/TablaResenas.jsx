import React from "react";
import ResenaRow from "../row/ResenaRow";
import "./TablaResenas.css";

const TablaResenas = ({ titulo = "Historial de reseñas", datos = [], onEliminar }) => {
  return (
    <div className="tabla-resenas-container">
      <h2>{titulo}</h2>
      <table className="tabla-resenas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Calificación</th>
            <th>Comentario</th>
            <th>Email</th>
            <th>Compra</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <ResenaRow
              key={idx}
              {...item}
              onEliminar={() => onEliminar && onEliminar(item)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResenas;
