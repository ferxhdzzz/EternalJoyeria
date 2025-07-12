import React, { useEffect } from "react";
import TablaResenas from "../components/reseñas/TablaResena/TablaResenas";
import Nav from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import "../styles/ResenasHist.css";
import useFetchResenas from "../hooks/Reseñas/useFetchResenas";
import useResenaAction from "../hooks/Reseñas/useResenaAction";

const HistorialResenas = () => {
  const { reviews, getReviews } = useFetchResenas();
  const { deleteReviews } = useResenaAction(getReviews);

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="page-layout">
      <div className="sidebar-fixed">
        <Nav />
      </div>
      <div className="main-area">
        <TopBar />
        <div className="content-area">
          <TablaResenas
            titulo="Historial de reseñas"
            reviews={reviews}
            deleteReviews={deleteReviews}
          />
        </div>
      </div>
    </div>
  );
};

export default HistorialResenas;
