// IMPORTACIÓN DE DEPENDENCIAS
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/Categorias/Button";
import "./EditDataProduct.css";

// COMPONENTE PRINCIPAL DE EDICIÓN DE PRODUCTO
const EditProduct = ({ productId, onClose, refreshProducts }) => {
  // ESTADOS PARA FORMULARIO Y MANEJO DE CATEGORÍAS E IMÁGENES
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    finalPrice: "",
    discountPercentage: "",
    stock: "",
    category_id: "",
    images: [],
  });

  // IMÁGENES PARA PREVISUALIZACIÓN, NUEVAS IMÁGENES Y LAS AGREGADAS
  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState({});
  const [addedImages, setAddedImages] = useState([]);

  // CARGAR DATOS DEL PRODUCTO CUANDO CAMBIA EL PRODUCTO ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar el producto");
        const data = await res.json();

        // SETEAR DATOS AL FORMULARIO
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category_id: data.category_id?._id || "",
          discountPercentage: data.discountPercentage || "",
          stock: data.stock || "",
          images: data.images || [],
        });
        setPreviewImages(data.images || []);
        setNewImages({});
        setAddedImages([]);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el producto",
          confirmButtonColor: "#d6336c",
        });
      }
    };
    loadProduct();
  }, [productId]);

  // CARGAR CATEGORÍAS DESDE EL BACKEND
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories", {
          withCredentials: true,
        });
        setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // ACTUALIZAR FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // REEMPLAZAR IMAGEN AL HACER CLICK SOBRE ELLA
  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setNewImages((prev) => ({ ...prev, [index]: file }));
        setPreviewImages((prev) =>
          prev.map((img, i) => (i === index ? URL.createObjectURL(file) : img))
        );
      }
    };
    input.click();
  };

  // AGREGAR NUEVAS IMÁGENES AL FORMULARIO
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setAddedImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // ELIMINAR IMAGEN DEL FORMULARIO
  const handleDeleteImage = (index) => {
    Swal.fire({
      title: "¿Eliminar esta imagen?",
      text: "No podrás recuperarla después",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d6336c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));

        // SI ES IMAGEN ORIGINAL
        const originalImagesCount = formData.images.length;
        if (index < originalImagesCount) {
          setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
          }));
          setNewImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
          });
        } else {
          // SI ES IMAGEN NUEVA
          const idxAdded = index - originalImagesCount;
          setAddedImages((prev) => prev.filter((_, i) => i !== idxAdded));
        }

        Swal.fire({
          icon: "success",
          title: "Imagen eliminada",
          confirmButtonColor: "#d6336c",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // ENVIAR FORMULARIO ACTUALIZADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();

      // AGREGAR CAMPOS NORMALES
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") form.append(key, value);
      });

      // IMÁGENES ORIGINALES QUE SE CONSERVAN
      const existingImages = previewImages.filter(
        (img, i) => typeof img === "string" && !(i in newImages)
      );
      form.append("existingImages", JSON.stringify(existingImages));

      // IMÁGENES REEMPLAZADAS
      Object.entries(newImages).forEach(([index, file]) => {
        form.append("images", file);
        form.append("replaceIndex", index);
      });

      // NUEVAS IMÁGENES
      addedImages.forEach((file) => {
        form.append("images", file);
      });

      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        body: form,
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Error al actualizar el producto");

      await refreshProducts();

      setLoading(false);
      await Swal.fire({
        icon: "success",
        title: "Producto actualizado",
        text: "El producto se actualizó correctamente.",
        confirmButtonColor: "#d6336c",
      });

      onClose();
    } catch (err) {
      setLoading(false);
      console.error("Error al actualizar producto:", err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.message || "Ocurrió un error inesperado",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  // RENDERIZADO DEL MODAL DE EDICIÓN
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="edit-modal-card scrollable-form">
        <h2 className="modal-title">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="edit-category-form">
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
                  src={img}
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

          <label>Agregar más imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImages}
            className="input-field"
          />

          <div className="buttons-roww">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Actualizando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} className="main-buttoon" disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// EXPORTAR COMPONENTE
export default EditProduct;
