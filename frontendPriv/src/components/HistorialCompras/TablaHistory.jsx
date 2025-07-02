import React from "react";
import HistorialComprasRow from "../HistorialCompras/HistoryRow";
import "./TablaHistory.css";

const TablaHistory = ({
  titulo = "Historial de compras",
  datos = [],
  onEliminar,
  onEditar,
}) => {
  return (
    <div className="tabla-historial-compras-container">
      <h2>{titulo}</h2>
      <table className="tabla-historial-compras">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Compra</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <HistorialComprasRow
              key={idx}
              {...item}
              onEliminar={() => onEliminar && onEliminar(item)}
              onEditar={() => onEditar && onEditar(item)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaHistory;
