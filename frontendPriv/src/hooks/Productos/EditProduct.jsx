import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditDataProduct.css";

const EditProduct = ({ productId, onClose, refreshProducts }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🌍 Opciones de países disponibles
  const countryOptions = [
    { value: "", label: "No especificado" },
    { value: "SV", label: "El Salvador (SV)" },
    { value: "US", label: "Estados Unidos (US)" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    category_id: "",
    country: "", // 🔹 NUEVO: Estado para el país
  });

  // previewImages ahora guarda objetos: { url: string, isNew: boolean, file?: File }
  const [previewImages, setPreviewImages] = useState([]);

  // ==============================
  // CARGAR PRODUCTO A EDITAR
  // ==============================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(
          `https://eternaljoyeria-cg5d.onrender.com/api/products/${productId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("No se pudo cargar el producto");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category_id: data.category_id?._id || "",
          discountPercentage: data.discountPercentage || "",
          stock: data.stock || "",
          country: data.country || "", // 🔹 Carga el país existente
        });

        // imágenes existentes
        const imagesData = (data.images || []).map((url) => ({
          url,
          isNew: false,
        }));
        setPreviewImages(imagesData);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el producto",
        });
      }
    };
    loadProduct();
  }, [productId]);

  // ==============================
  // CARGAR CATEGORÍAS
  // ==============================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://eternaljoyeria-cg5d.onrender.com/api/categories",
          { withCredentials: true }
        );

        // Garantizar que sea array
        const cat = Array.isArray(res.data)
          ? res.data
          : res.data.categories || [];

        setCategories(cat);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategories([]); // evitar errores
      }
    };

    fetchCategories();
  }, []);

  // ==============================
  // MANEJO DE CAMPOS
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==============================
  // REEMPLAZAR UNA IMAGEN EXISTENTE
  // ==============================
  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
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

  // ==============================
  // AGREGAR NUEVAS IMÁGENES
  // ==============================
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    const filteredFiles = files.filter((file) => {
      return !previewImages.some(
        (img) =>
          img.isNew &&
          img.file &&
          img.file.name === file.name &&
          img.file.size === file.size &&
          img.file.lastModified === file.lastModified
      );
    });

    if (filteredFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const newImagesObjs = filteredFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    setPreviewImages((prev) => [...prev, ...newImagesObjs]);

    e.target.value = "";
  };

  // ==============================
  // ELIMINAR IMAGEN
  // ==============================
  const handleDeleteImage = (index) => {
    Swal.fire({
      title: "¿Eliminar esta imagen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        setPreviewImages((prev) => {
          if (prev[index].isNew) {
            URL.revokeObjectURL(prev[index].url);
          }
          return prev.filter((_, i) => i !== index);
        });
      }
    });
  };

  // ==============================
  // ENVIAR FORMULARIO (PUT)
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // 🔹 Incluir todos los campos de formData, incluyendo 'country'
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      // Imágenes existentes (urls)
      const existingImages = previewImages
        .filter((img) => !img.isNew)
        .map((img) => img.url);

      form.append("existingImages", JSON.stringify(existingImages));

      // Imágenes nuevas
      previewImages
        .filter((img) => img.isNew && img.file)
        .forEach((img) => {
          form.append("images", img.file);
        });

      const res = await fetch(
        `https://eternaljoyeria-cg5d.onrender.com/api/products/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          body: form,
        }
      );

      const resJson = await res.json();

      if (!res.ok) throw new Error(resJson.message || "Error al actualizar");

      await refreshProducts();
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Producto actualizado",
      });

      onClose();
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="edit-modal-card scrollable-form">
        <h2 className="modal-title">Editar Producto</h2>

        <form onSubmit={handleSubmit} className="edit-category-form">
          {/* Nombre */}
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />

          {/* Descripción */}
          <label>Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
          />

          {/* Precio */}
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="input-field"
          />

          {/* Categoría */}
          <label>Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="select"
            required
          >
            <option value="">Selecciona Categoría</option>

            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>

          {/* 🌍 NUEVO: Selector de País */}
          <label>País de origen</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="select"
          >
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>

          {/* Descuento */}
          <label>% Descuento</label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            className="input-field"
          />

          {/* Stock */}
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input-field"
          />

          {/* Imágenes actuales */}
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
                  style={{
                    position: "absolute",
                    top: "-25px",
                    right: "-15px",
                    background: "transparent",
                    color: "black",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "20px",
                    lineHeight: "18px",
                  }}
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Agregar imágenes */}
          <label>Agregar más imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImages}
            className="input-field"
          />

          {/* Botones */}
          <div className="buttons-roww">
            <button
              type="button"
              onClick={onClose}
              className="main-buttoon"
              disabled={loading}
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Actualizando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;