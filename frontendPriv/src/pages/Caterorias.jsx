// src/pages/Categorias.jsx
import React, { useEffect, useState } from "react";
import SidebarPrivate from "../components/Sidebar/Sidebar";
import TopNavbarPrivate from "../components/TopBar/TopBar";

import CategoriasGrid from "../components/Categorias/CategoriasGrid";
import EditCategoryModal from "../components/Categorias/EditCategoryModal";
import CategoriasForm from "../components/Categorias/FormPage";

import useFecthCategorias from "../hooks/Categorias/useFecthCategorias";
import "../styles/ProductsPage-Private.css";
import "../styles/Shared/buttons.css";

const Categorias = () => {
  const { categories, getCategories } = useFecthCategorias();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => { getCategories(); }, []);

  const refreshCategories = async () => { await getCategories(); };

  return (
    <div className="products-private-page-containerr">
      <SidebarPrivate />

      <div className="main-content-wrapperr">
        <div className="fixed-topbarr">
          <TopNavbarPrivate />
        </div>

        <div className="scrollable-contentr">
          <div className="padded-content-wrapperr">
            <div className="cat-page-grid">
              <section className="cat-left">
                <CategoriasGrid
                  categorias={categories}
                  refreshCategories={refreshCategories}
                  onEdit={(cat) => {
                    setSelectedCategory(cat);
                    setOpenEdit(true);
                  }}
                />
              </section>

              <aside className="cat-right">
                <CategoriasForm refreshCategories={refreshCategories} />
              </aside>
            </div>
          </div>
        </div>
      </div>

      {openEdit && selectedCategory && (
        <EditCategoryModal
          categorie={selectedCategory}
          onClose={() => { setOpenEdit(false); setSelectedCategory(null); }}
          refreshCategories={refreshCategories}
        />
      )}
    </div>
  );
};

export default Categorias;
