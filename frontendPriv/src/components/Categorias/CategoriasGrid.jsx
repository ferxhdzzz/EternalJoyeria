// src/components/Categorias/CategoriasGrid.jsx
import React, { useState } from "react";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
import "../../styles/Shared/buttons.css";
import ConfirmacionModal from "../reseñas/modal/ConfirmacionModal"; // o ../resenas/...

export default function CategoriasGrid({
  categorias = [],
  refreshCategories,
  onEdit,
}) {
  const { deleteCategorieById } = useDataCategorie();
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

  const abrirConfirm = (cat) =>
    setConfirm({ open: true, id: cat._id || cat.id, name: cat.name || "" });

  const cerrarConfirm = () => setConfirm({ open: false, id: null, name: "" });

  const eliminarCategoria = async () => {
    try {
      await deleteCategorieById(confirm.id);
      await refreshCategories?.();
    } catch (e) {
      console.error(e);
    } finally {
      cerrarConfirm();
    }
  };

  return (
    <>
      <div className="categorias-grid">
        {categorias.map((cat) => (
          <article key={cat._id || cat.id} className="categoria-card">
            {cat.image && (
              <div className="categoria-media">
                <img src={cat.image} alt={cat.name} />
              </div>
            )}

            <h3 className="categoria-title">{cat.name}</h3>
            <p className="categoria-desc">{cat.description || "—"}</p>

            <div className="categoria-actions">
              <button
                type="button"
                className="ej-btn ej-approve ej-size-sm"
                onClick={() => onEdit?.(cat)}
              >
                Editar
              </button>
              <button
                type="button"
                className="ej-btn ej-danger ej-size-sm"
                onClick={() => abrirConfirm(cat)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {confirm.open && (
        <ConfirmacionModal
          mensaje={
            confirm.name
              ? `¿Está seguro de eliminar la categoría “${confirm.name}”?`
              : "¿Está seguro de eliminar esta categoría?"
          }
          onConfirmar={eliminarCategoria}
          onCancelar={cerrarConfirm}
        />
      )}
    </>
  );
}
