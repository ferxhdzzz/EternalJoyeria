// IMPORTACIÓN DE DEPENDENCIAS Y COMPONENTES NECESARIOS
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAddProduct } from "../hooks/Productos/useAddProduct";
import TopBar from "../components/TopBar/TopBar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/AddProducts/AgregarProducto.css";

// DEFINICIÓN DEL COMPONENTE PRINCIPAL
export default function AddProductPage() {
  // ACCESO A LA FUNCIÓN PERSONALIZADA PARA AGREGAR PRODUCTOS
  const { addProduct } = useAddProduct();

  // ESTADO PARA INDICAR CARGA DURANTE LA SUBIDA
  const [loading, setLoading] = useState(false);

  // ESTADO PARA GUARDAR CATEGORÍAS OBTENIDAS DEL SERVIDOR
  const [categories, setCategories] = useState([]);

  // ESTADO PARA MANEJAR LOS DATOS DEL FORMULARIO
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

  // EFECTO PARA OBTENER CATEGORÍAS AL CARGAR EL COMPONENTE
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories", {
          withCredentials: true,
        });
        const data = res.data;
        const categoriesArray = Array.isArray(data)
          ? data
          : data.categories || [];
        setCategories(categoriesArray);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategories([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las categorías",
          confirmButtonColor: "#d6336c",
        });
      }
    };

    fetchCategories();
  }, []);

  // MANEJADOR PARA CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // VERIFICA SI ES UN CAMPO DE MEDIDA PARA ACTUALIZARLO CORRECTAMENTE
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

  // MANEJADOR PARA SUBIR IMÁGENES
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // MANEJADOR PARA ELIMINAR UNA IMAGEN POR ÍNDICE
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // MANEJADOR PARA ENVIAR EL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN DE CATEGORÍA
    if (!formData.category_id) {
      Swal.fire({
        icon: "warning",
        title: "Falta categoría",
        text: "Por favor selecciona una categoría",
        confirmButtonColor: "#d6336c",
      });
      return;
    }

    setLoading(true);

    // CONSTRUCCIÓN DEL FORMULARIO MULTIPARTE
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

    // ENVÍO DEL PRODUCTO AL SERVIDOR
    try {
      await addProduct(data);
      setLoading(false);

      // MENSAJE DE ÉXITO
      await Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto se agregó correctamente.",
        confirmButtonColor: "#d6336c",
      });

      // OPCIONAL: LIMPIAR EL FORMULARIO LUEGO DE ENVIAR
      setFormData({
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
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al agregar el producto",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  // RETORNO DEL COMPONENTE
  return (
    <div className="container-main">
      {/* SIDEBAR A LA IZQUIERDA */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        {/* BARRA SUPERIOR */}
        <div className="topbar-wrapper">
          <TopBar />
        </div>

        <br />
        <br />

        {/* CONTENIDO DEL FORMULARIO */}
        <div className="add-product-content">
          <form className="form" onSubmit={handleSubmit}>
            {/* PRIMERA FILA: CAMPOS DE NOMBRE, PRECIO, DESCUENTO Y STOCK */}
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

            {/* CAMPO DE DESCRIPCIÓN */}
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                className="custom-textarea"
                placeholder="Descripción del producto"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* SELECCIÓN DE CATEGORÍA */}
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
                  <option
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPOS DE MEDIDAS: LARGO, ANCHO, PESO */}
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

            {/* SECCIÓN DE SUBIDA DE IMÁGENES */}
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

                {/* MENSAJE SI NO HAY IMÁGENES */}
                {formData.images.length === 0 && (
                  <div className="image-placeholder">
                    <span>Vista previa de la imagen</span>
                  </div>
                )}
              </div>

              {/* PREVISUALIZACIÓN DE IMÁGENES SUBIDAS */}
              {formData.images.length > 0 && (
                <div className="preview">
                  {formData.images.map((file, index) => (
                    <div key={index} className="image-preview-container">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="preview-img"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÓN DE ENVÍO DEL FORMULARIO */}
            <button type="submit" disabled={loading} className="prod">
              {loading ? "Agregando..." : "Agregar Producto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
