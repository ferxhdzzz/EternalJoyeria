import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditDataProduct.css";
import "../../styles/shared/buttons.css";

const EditProduct = ({ productId, onClose, refreshProducts }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    category_id: "",
  });

  // previewImages: { url: string, isNew: boolean, file?: File }
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar el producto");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category_id: data.category_id?._id || "",
          discountPercentage: data.discountPercentage || "",
          stock: data.stock || "",
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
        const res = await axios.get("http://localhost:4000/api/categories", {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reemplazar imagen existente
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

  // Agregar imágenes nuevas
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

  // Eliminar imagen (sea nueva o existente)
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
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));

      // URLs que se mantienen
      const existingImages = previewImages.filter((i) => !i.isNew).map((i) => i.url);
      form.append("existingImages", JSON.stringify(existingImages));

      // Nuevas imágenes
      previewImages
        .filter((i) => i.isNew && i.file)
        .forEach((i) => form.append("images", i.file));

      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
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
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="edit-modal-card scrollable-form">
        <h2 className="modal-title">Editar Producto</h2>

        {/* usa la clase que mapea tu CSS del modal */}
        <form onSubmit={handleSubmit} className="edit-product-form">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
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
            {/* Pálido (danger) como pediste */}
            <label
  htmlFor="moreProductImages"
  className="ej-btn ej-danger ej-size-sm ej-file"
>
  Agregar foto
</label>

          </div>

          <div className="buttons-row ej-btn-set" style={{ marginTop: 12 }}>
            <button type="submit" className="ej-btn ej-approve" disabled={loading}>
              {loading ? "Actualizando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} className="ej-btn ej-danger" disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
