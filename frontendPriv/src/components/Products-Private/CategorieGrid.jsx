import React, { useState } from "react";
import CategoriaCard from "./CategoriaCard";
import EditCategoryModal from "../Categorias/EditCategoryModal";
import Swal from "sweetalert2";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
import useCategoriasAction from "../../hooks/Categorias/useCategoriasAction";

const CategorieGrid = ({ cats = [], refreshCategories }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const { deleteCategorieById } = useCategoriasAction({});

  const handleEdit = (categorie) => {
    setEditingCategory(categorie);
  };

  const handleDelete = (categorie) => {
    Swal.fire({
      title: "¿Seguro que quieres eliminar esta categoría?",
      icon: "warning",
      showCancelButton: true,
     confirmButtonColor: "#d6336c",
     cancelButtonColor: "#96a2afff",
        confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
      
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategorieById(categorie._id);
        refreshCategories(); // 🔁 Refresca la lista tras eliminar
        Swal.fire("Eliminado!", "La categoría fue eliminada.", "success");
      }
    });
  };

  const closeModal = () => setEditingCategory(null);

  return (
    <>
      <div className="product-grid-private">
        {cats.map((cat) => (
          <CategoriaCard
            key={cat._id}
            categorie={cat}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingCategory && (
        <EditCategoryModal
          categorie={editingCategory}
          onClose={closeModal}
          refreshCategories={refreshCategories} // ✅ importante
        />
      )}
    </>
  );
};

export default CategorieGrid;
