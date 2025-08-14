import React, { useEffect } from "react";
import SidebarPrivate from "../components/Sidebar/Sidebar";
import TopNavbarPrivate from "../components/TopBar/TopBar";
import CategorieGrid from "../components/Products-Private/CategorieGrid";
import CategoriasForm from "../components/Categorias/FormPage";
import useFecthCategorias from "../hooks/Categorias/useFecthCategorias";
import "../styles/ProductsPage-Private.css";

const Categorias = () => {
  const { categories, getCategories } = useFecthCategorias();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="products-private-page-containerr">
      <SidebarPrivate />

      <div className="main-content-wrapperr">
        <div className="fixed-topbarr">
          <TopNavbarPrivate />
        </div>

        <div className="scrollable-contentr">
          <div className="padded-content-wrapperr">
            <div className="products-area-privater">
              <CategorieGrid cats={categories} refreshCategories={getCategories} />
              {/* ✅ Le pasamos la función para que el form pueda actualizar */}
              <CategoriasForm refreshCategories={getCategories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorias;
