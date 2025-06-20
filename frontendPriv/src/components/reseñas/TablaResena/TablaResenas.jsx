import React from "react";
import ResenaRow from "../row/ResenaRow";
import "./TablaResenas.css";

const data = [
  { nombre: "Jennifer Huh", calificacion: 5, comentario: "muy bueno", email: "jennifer@microsoft.com", compra: "Collar" },
  { nombre: "José martínez", calificacion: 5, comentario: "muy bueno", email: "jose@yahoo.com", compra: "Pulsera" },
  { nombre: "Ronald Richards", calificacion: 5, comentario: "muy bueno", email: "ronald@adobe.com", compra: "Anillos" },
  { nombre: "Kevin Cruz", calificacion: 4, comentario: "muy bueno", email: "kevin@tesla.com", compra: "Aritos" },
  { nombre: "Romel Diaz", calificacion: 4, comentario: "muy bueno", email: "romel@google.com", compra: "Collar" },
  { nombre: "Karina Yu", calificacion: 4.5, comentario: "muy bueno", email: "katarina@microsoft.com", compra: "Anillos" },
  { nombre: "Giselle Hernandez", calificacion: 5, comentario: "muy bueno", email: "gigi@yahoo.com", compra: "Collar" },
  { nombre: "Kristin Watson", calificacion: 4.8, comentario: "muy bueno", email: "kristin@facebook.com", compra: "Pulsera" },
];

const TablaResenas = () => {
  return (
    <div className="tabla-resenas-container">
      <h2>Historial de reseñas</h2>
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
          {data.map((item, idx) => (
            <ResenaRow
              key={idx}
              {...item}
              onEliminar={() => alert(`Eliminar reseña de ${item.nombre}`)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResenas;
