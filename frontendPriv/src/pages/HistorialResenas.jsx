import React from "react";
import TablaResenas from "../components/reseñas/TablaResena/TablaResenas";
import Nav from "../components/Sidebar/Sidebar";
import Layout from "../components/layout/Layout";

import "../styles/ResenasHist.css";

const HistorialResenas = () => {
  return (
    <>
    <Nav />
 
    <div className="historial-wrapper">
      <Layout />
      <TablaResenas />
    </div>
    </>
  );
};

export default HistorialResenas;