// frontendPriv/src/hooks/Productos/EditProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/shared/buttons.css";
import "../../styles/shared/modal.css";
import EJModal from "../../components/Ui/EJModal.jsx";
import "./EditDataProduct.css"; // Mantén estilos

const EditProduct = ({ productId, onClose, refreshProducts }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // NOTA: añadimos campos para estado defectuoso/deteriorado
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    category_id: "",
    // nuevos:
    condition: "OK",                 // "OK" | "DEFECTUOSO" | "DETERIORADO"
    defectNote: "",                  // texto opcional
    isDefectiveOrDeteriorated: false,// redundante, para el backend (compatibilidad)
    defectType: null,                // "defective" | "deteriorated" | null
  });

  // previewImages: { url: string, isNew: boolean, file?: File }
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/products/${productId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar el producto");
        const data = await res.json();

        // Derivamos estado a partir de campos si existen
        let derivedCondition = "OK";
        if (data.condition) {
          const c = String(data.condition).toUpperCase();
          if (c === "DEFECTUOSO" || c === "DETERIORADO") derivedCondition = c;
        } else if (data.isDefectiveOrDeteriorated === true) {
          derivedCondition = (data.defectType === "deteriorated") ? "DETERIORADO" : "DEFECTUOSO";
        }

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          category_id: data.category_id?._id || "",
          discountPercentage: data.discountPercentage ?? "",
          stock: data.stock ?? "",
          condition: derivedCondition,
          defectNote: data.defectNote || "",
          isDefectiveOrDeteriorated: !!data.isDefectiveOrDeteriorated,
          defectType: data.defectType || (derivedCondition === "DETERIORADO" ? "deteriorated" :
                                          derivedCondition === "DEFECTUOSO" ? "defective" : null),
        });

        const imagesData = (data.images || []).map((url) => ({ url, isNew: false }));
        setPreviewImages(imagesData);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar el producto" });
      }
    };
    loadProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://eternaljoyeria-cg5d.onrender.com/api/categories", {
          withCredentials: true,
        });
        setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el cambio es de "condition", sincronizamos el resto de campos relacionados
    if (name === "condition") {
      const next = value;
      if (next === "OK") {
        setFormData((prev) => ({
          ...prev,
          condition: "OK",
          isDefectiveOrDeteriorated: false,
          defectType: null,
          // mantenemos defectNote pero puedes vaciarla si prefieres:
          // defectNote: "",
        }));
      } else if (next === "DEFECTUOSO") {
        setFormData((prev) => ({
          ...prev,
          condition: "DEFECTUOSO",
          isDefectiveOrDeteriorated: true,
          defectType: "defective",
        }));
      } else if (next === "DETERIORADO") {
        setFormData((prev) => ({
          ...prev,
          condition: "DETERIORADO",
          isDefectiveOrDeteriorated: true,
          defectType: "deteriorated",
        }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (previewImages[index].isNew) {
          URL.revokeObjectURL(previewImages[index].url);
        }
        const newUrl = URL.createObjectURL(file);
        setPreviewImages((prev) => {
          const copy = [...prev];
          copy[index] = { url: newUrl, isNew: true, file };
          return copy;
        });
      }
    };
    input.click();
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const filtered = files.filter((file) => {
      return !previewImages.some(
        (img) =>
          img.isNew &&
          img.file &&
          img.file.name === file.name &&
          img.file.size === file.size &&
          img.file.lastModified === file.lastModified
      );
    });

    if (filtered.length === 0) {
      e.target.value = "";
      return;
    }

    const newObjs = filtered.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    setPreviewImages((prev) => [...prev, ...newObjs]);
    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    Swal.fire({
      title: "¿Eliminar esta imagen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        setPreviewImages((prev) => {
          if (prev[index].isNew) URL.revokeObjectURL(prev[index].url);
          return prev.filter((_, i) => i !== index);
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();

      // Campos básicos
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category_id", formData.category_id);
      form.append("discountPercentage", formData.discountPercentage ?? "");
      form.append("stock", formData.stock ?? "");

      // Sincronía de estado: enviamos ambos por compatibilidad
      form.append("condition", formData.condition);
      const flagged = formData.condition !== "OK";
      form.append("isDefectiveOrDeteriorated", flagged ? "true" : "false");
      if (flagged) {
        form.append(
          "defectType",
          formData.condition === "DETERIORADO" ? "deteriorated" : "defective"
        );
        if (formData.defectNote) form.append("defectNote", formData.defectNote);
      }

      // Imágenes existentes (urls)
      const existingImages = previewImages.filter((i) => !i.isNew).map((i) => i.url);
      form.append("existingImages", JSON.stringify(existingImages));

      // Imágenes nuevas (archivos)
      previewImages
        .filter((i) => i.isNew && i.file)
        .forEach((i) => form.append("images", i.file));

      const res = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        body: form,
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Error al actualizar el producto");

      await refreshProducts?.();
      setLoading(false);
      Swal.fire({ icon: "success", title: "Producto actualizado" });
      onClose?.();
    } catch (err) {
      setLoading(false);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <EJModal
      isOpen={true}
      onClose={onClose}
      title="Editar Producto"
      footer={
        <>
          <button type="button" className="ej-btn ej-danger ej-size-sm" onClick={onClose}>
            Cancelar
          </button>
          <button form="edit-product-form" type="submit" className="ej-btn ej-approve ej-size-sm" data-autofocus>
            {loading ? "Actualizando..." : "Guardar"}
          </button>
        </>
      }
    >
      <form id="edit-product-form" onSubmit={handleSubmit} className="edit-product-form">
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
          data-autofocus
        />

        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
        />

        <label>Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label>Categoría</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="select"
          required
        >
          <option value="">Selecciona Categoría</option>
          {categories.map((category) => (
            <option key={category._id || category.id} value={category._id || category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>% Descuento</label>
        <input
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleChange}
          className="input-field"
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="input-field"
        />

        {/* ===================== Estado del producto ===================== */}
        <label>Estado del producto</label>
        <div style={{ width: "90%", display: "grid", gap: 8, marginTop: 6 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="condition"
                value="OK"
                checked={formData.condition === "OK"}
                onChange={handleChange}
              />
              OK
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="condition"
                value="DEFECTUOSO"
                checked={formData.condition === "DEFECTUOSO"}
                onChange={handleChange}
              />
              DEFECTUOSO
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="condition"
                value="DETERIORADO"
                checked={formData.condition === "DETERIORADO"}
                onChange={handleChange}
              />
              DETERIORADO
            </label>
          </div>

          <label style={{ paddingLeft: 0, marginTop: 4 }}>Nota (opcional)</label>
          <textarea
            name="defectNote"
            placeholder="Describe el defecto/deterioro (opcional)"
            value={formData.defectNote}
            onChange={handleChange}
            className="input-field"
            disabled={formData.condition === "OK"}
          />
        </div>
        {/* ============================================================= */}

        <label>Imágenes actuales</label>
        <div className="edit-image-preview">
          {previewImages.map((img, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={img.url}
                alt={`preview-${index}`}
                className="editable-img"
                onClick={() => handleImageClick(index)}
                title="Click para reemplazar"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="ej-btn ej-danger ej-size-xs"
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  padding: "0 10px",
                  borderRadius: "999px",
                  minWidth: "auto",
                }}
                aria-label="Eliminar imagen"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <label>Agregar más imágenes</label>
        <div className="file-input-wrapper" style={{ marginBottom: 8 }}>
          <input
            type="file"
            id="moreProductImages"
            multiple
            accept="image/*"
            onChange={handleAddImages}
            className="file-input-hidden"
          />
          <label htmlFor="moreProductImages" className="ej-btn ej-danger ej-size-sm ej-w-140">
            Agregar foto
          </label>
        </div>
      </form>
    </EJModal>
  );
};

export default EditProduct;
