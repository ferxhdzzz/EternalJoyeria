import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAddProduct } from "../hooks/Productos/useAddProduct";
import TopBar from "../components/TopBar/TopBar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/AddProducts/AgregarProducto.css";

export default function AddProductPage() {
  const { addProduct, loading } = useAddProduct();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    category_id: "",
    measurements: {
      weight: "",
      height: "",
      width: "",
    },
    images: [],
  });

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/categories", {
        withCredentials: true, // <-- para enviar cookies
      });
      const data = res.data;
      const categoriesArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setCategories([]);
    }
  };

  fetchCategories();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["weight", "height", "width"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPercentage", formData.discountPercentage);
    data.append("stock", formData.stock);
    data.append("category_id", formData.category_id);
    data.append("measurements", JSON.stringify(formData.measurements));

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    await addProduct(data);
  };

  return (
    <div className="container-main">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="add-product-content">
          <h2>Agregar Producto</h2>
          
          <form className="form" onSubmit={handleSubmit}>
            {/* Primera fila: Nombre, Precio, Descuento, Stock */}
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del producto</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del producto"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descuento</label>
                <input
                  type="number"
                  name="discountPercentage"
                  placeholder="Descuento (%)"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Cantidad en stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Segunda fila: Descripción */}
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                placeholder="Descripción del producto"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Tercera fila: Categoría */}
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona Categoría</option>
                {categories.map((category) => (
                  <option key={category._id || category.id} value={category._id || category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sección de medidas */}
            <div className="measurements-section">
              <h4>Medidas</h4>
              <div className="measurements-grid">
                <div className="form-group">
                  <label>Largo</label>
                  <input
                    type="text"
                    name="height"
                    placeholder="Largo"
                    value={formData.measurements.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ancho</label>
                  <input
                    type="text"
                    name="width"
                    placeholder="Ancho"
                    value={formData.measurements.width}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Peso (g)</label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="Peso"
                    value={formData.measurements.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Sección de imágenes */}
            <div className="images-section">
              <h4>Imágenes</h4>
              <div className="image-upload-area">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="images" className="file-input-label">
                    Subir imagen
                  </label>
                </div>
                
                {formData.images.length === 0 && (
                  <div className="image-placeholder">
                    <span>Vista previa de la imagen</span>
                  </div>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="preview">
                  {formData.images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Producto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
