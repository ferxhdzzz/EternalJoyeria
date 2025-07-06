import React from "react";
import TablaHistorialCompras from "../components/HistorialCompras/TablaHistory";
import Nav from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import "../styles/HistorialCompras.css";

const dataHistorialCompras = [
  { nombre: "Jennifer Huh", estado: "Pendiente", direccion: "(503) 555-0118", email: "jennifer@microsoft.com", compra: "Collar" },
  { nombre: "José Martínez", estado: "Entregada", direccion: "(503) 555-0100", email: "jose@yahoo.com", compra: "Pulsera" },
  { nombre: "Ronald Richards", estado: "En camino", direccion: "(503) 555-0107", email: "ronald@adobe.com", compra: "Anillos" },
  { nombre: "Kevin Cruz", estado: "Pendiente", direccion: "(503) 555-0126", email: "kevin@tesla.com", compra: "Aritos" },
  { nombre: "Romet Diaz", estado: "Entregada", direccion: "(503) 555-0129", email: "romel@google.com", compra: "Collar" },
  { nombre: "Karina Yu", estado: "Pendiente", direccion: "(503) 555-0120", email: "katarina@microsoft.com", compra: "Anillos" },
  { nombre: "Giselle Hernandez", estado: "En camino", direccion: "(503) 555-0112", email: "gigi@yahoo.com", compra: "Collar" },
  { nombre: "Kristin Watson", estado: "Pendiente", direccion: "(503) 555-0127", email: "kristn@facebook.com", compra: "Pulsera" },
];

const HistorialCompras = () => {
  return (
    <div className="page-layout">
      <Nav />
      <div className="main-area">
        <TopBar />
        <div className="content-area">
          <TablaHistorialCompras
            titulo="Historial de compras"
            datos={dataHistorialCompras}
            onEliminar={(item) => alert(`Eliminar compra de ${item.nombre}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default HistorialCompras;