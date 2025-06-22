import React from "react";
import TablaResenas from "../components/reseñas/TablaResena/TablaResenas";
import Nav from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import "../styles/ResenasHist.css";

const dataResenas = [
  { nombre: "Jennifer Huh", calificacion: 5, comentario: "muy bueno", email: "jennifer@microsoft.com", compra: "Collar" },
  { nombre: "José Martínez", calificacion: 5, comentario: "excelente", email: "jose@yahoo.com", compra: "Pulsera" },
];

const HistorialResenas = () => {
  return (
    <div className="page-layout">
      <Nav />
      <div className="main-area">
        <TopBar />
        <div className="content-area">
          <TablaResenas
            titulo="Historial de reseñas"
            datos={dataResenas}
            onEliminar={(item) => alert(`Eliminar reseña de ${item.nombre}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default HistorialResenas;
