import React, { useEffect, useState, useMemo } from "react";
import TablaResenas from "../components/reseñas/TablaResena/TablaResenas";
import Nav from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import "../styles/ResenasHist.css";
// Corregida la importación si cambiaste el nombre
import useFetchResenas from "../hooks/Reseñas/useFetchResenas"; 
import useResenaAction from "../hooks/Reseñas/useResenaAction";

const HistorialResenas = () => {
  // Ahora también recibimos 'products'
  const { reviews, getReviews, products } = useFetchResenas(); 
  const { deleteReviews } = useResenaAction(getReviews);
  
  // Nuevo estado para el filtro
  const [selectedProduct, setSelectedProduct] = useState("all"); 

  useEffect(() => {
    getReviews();
  }, []);

  // Lógica de filtrado
  const filteredReviews = useMemo(() => {
    if (selectedProduct === "all") {
      return reviews;
    }
    return reviews.filter(
      (review) => review.id_product?._id === selectedProduct
    );
  }, [reviews, selectedProduct]);

  return (
    <div className="page-layout">
      <div className="sidebar-fixed">
        <Nav />
      </div>
      <div className="main-area">
        <TopBar />
        <div className="content-area">
          <div className="filter-controls">
            <label htmlFor="product-filter">Filtrar por producto:</label>
            <select
              id="product-filter"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="product-filter-select"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <TablaResenas
            titulo={`Historial de reseñas (${filteredReviews.length})`}
            reviews={filteredReviews} // Pasamos las reseñas filtradas
            deleteReviews={deleteReviews}
          />
        </div>
      </div>
    </div>
  );
};

export default HistorialResenas;