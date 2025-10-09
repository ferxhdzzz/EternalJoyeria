import React, { useEffect, useState, useMemo } from "react";
// Importamos el componente de Tarjeta de Reseña (AdminReviewItem)
import AdminReviewItem from "../components/reseñas/TablaResena/AdminReviewItem"; 
import Nav from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import "../styles/ResenasHist.css";
// Usaremos el useFetch que ya tenías para el Dashboard
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
          <h2 className="historial-title-admin">Historial de Reseñas</h2>
          
          {/* CONTROL DE FILTRO */}
          <div className="filter-controls-admin">
            <label htmlFor="product-filter">Filtrar por producto:</label>
            <select
              id="product-filter"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="product-filter-select-admin"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          {/* FIN CONTROL DE FILTRO */}

          <div className="reviews-list-admin">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                // Usamos una tarjeta de reseña similar a la pública
                <AdminReviewItem 
                  key={review._id}
                  review={review}
                  onDelete={deleteReviews} // Pasamos la acción de eliminar
                />
              ))
            ) : (
              <p className="empty-state-admin">No hay reseñas disponibles para los filtros seleccionados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialResenas;