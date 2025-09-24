import React from "react";
import Swal from "sweetalert2";
import useDataCategorias from "../../hooks/Categorias/useDataCategorias";
import "../../styles/Shared/buttons.css";
import "./CategoriasGrid.css";

/**
 * Props esperadas:
 * - categorias: array de categorías (cada una con _id, name, description, image)
 * - refreshCategories: función para recargar
 * - onEdit: (cat) => void
 */
const CategoriasGrid = ({ categorias = [], refreshCategories, onEdit }) => {
  const { deleteCategorieById } = useDataCategorias();

  const onDelete = async (cat) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: `Se eliminará "${cat.name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e57373",
      cancelButtonColor: "#9e9e9e",
      reverseButtons: true,
    });

    if (!isConfirmed) return;

    const ok = await deleteCategorieById(cat._id);
    if (ok) {
      await refreshCategories?.();
    }
  };

  if (!categorias || categorias.length === 0) {
    return <p style={{ opacity: 0.7 }}>No hay categorías aún.</p>;
  }

  return (
    <div className="categorias-grid">
      {categorias.map((cat) => (
        <article key={cat._id} className="categoria-card">
          <div className="cat-thumb">
            <img src={cat.image} alt={cat.name} />
          </div>

          <div className="cat-body">
            <h4 className="cat-title">{cat.name}</h4>
            <p className="cat-desc">{cat.description}</p>
          </div>

          <div className="cat-actions">
            <button
              className="ej-btn ej-approve ej-size-sm ej-w-120"
              onClick={() => onEdit?.(cat)}
              title="Editar"
            >
              Editar
            </button>

            <button
              className="ej-btn ej-danger ej-size-sm ej-w-120"
              onClick={() => onDelete(cat)}
              title="Eliminar"
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default CategoriasGrid;
