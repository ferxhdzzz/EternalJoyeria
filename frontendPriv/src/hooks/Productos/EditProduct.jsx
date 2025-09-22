// frontendPriv/src/hooks/Productos/EditProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/shared/buttons.css";
import "../../styles/shared/modal.css";
import EJModal from "../../components/Ui/EJModal.jsx";
import "./EditDataProduct.css"; // Mantén estilos internos (grid, inputs). Quita overlays/card si existían.

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
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));

      const existingImages = previewImages.filter((i) => !i.isNew).map((i) => i.url);
      form.append("existingImages", JSON.stringify(existingImages));

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
