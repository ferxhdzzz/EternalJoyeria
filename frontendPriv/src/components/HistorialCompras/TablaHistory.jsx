import React from "react";
import HistorialComprasRow from "../HistorialCompras/HistoryRow";
import "./TablaHistory.css";

const TablaHistory = ({ titulo = "Historial de compras", datos = [], onEliminar }) => {
  return (
    <div className="tabla-historial-compras-container">
      <h2>{titulo}</h2>
      <div className="scroll-wrapper">
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaHistory;
