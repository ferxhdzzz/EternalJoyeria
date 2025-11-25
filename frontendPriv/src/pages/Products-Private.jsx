import React, { useState } from "react";
import Swal from "sweetalert2";
import Titulo from "../components/Componte-hook/Titulos";
import SubTitulo from "../components/Componte-hook/SubTitulo";
import Button from "../components/Componte-hook/Button";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/TopBar/TopBar";
import EditProduct from "../hooks/Productos/EditProduct";
import "../styles/PaginaProduct.css";
import "../styles/CategoryFilterBar.css";

import { useDataProduct } from "../hooks/Productos/UseDataProduct";
import useDataCategorias from "../hooks/Categorias/useDataCategorias";
import ImageSlider from "../components/Componte-hook/ImageSlider";

// ...imports y hooks iguales
const Products = () => {
  const { products, deleteProduct, fetchProducts } = useDataProduct();
  const { categories } = useDataCategorias();

  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedCountry, setSelectedCountry] = useState("Todos"); // 🔹 Estado del filtro de país
  const [editingProductId, setEditingProductId] = useState(null);

  const safeProducts = Array.isArray(products) ? products : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];

  // 🌍 Opciones del filtro de país
  const countryOptions = ["Todos", "SV", "US"]; 

  // 🔥 Lógica de filtrado de país mejorada
  const filteredProducts = safeProducts.filter((p) => {
    const categoryMatch = selectedCategory === "Todas" || p.category_id?.name === selectedCategory;
    
    // Convertir el país del producto a mayúsculas o usar una cadena vacía si es null/undefined
    const productCountry = (p.country || "").toUpperCase(); 

    let countryMatch;
    
    if (selectedCountry === "Todos") {
      // Si es "Todos", incluye TODOS los productos (sin país, SV, US, o cualquier otro)
      countryMatch = true;
    } else {
      // Si es "SV" o "US", solo coinciden si el país del producto es exactamente ese.
      countryMatch = productCountry === selectedCountry.toUpperCase();
    }

    return categoryMatch && countryMatch;
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro que deseas eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d6336c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          text: "El producto fue eliminado correctamente.",
          confirmButtonColor: "#d6336c",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto.",
          confirmButtonColor: "#d6336c",
        });
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="topbar-wrapper">
          <Topbar />
        </div>

        <div className="products-container">
          <div className="products-header">
            <Titulo>Lista de Productos</Titulo>
            <SubTitulo>Administra tus productos fácilmente</SubTitulo>
          </div>

          <div className="category-filter-wrapper">
            {/* Filtros por categoría */}
            <div className="category-filter-bar">
              {/* Contenido de filtro de categoría (sin cambios) */}
              <Button
                className={selectedCategory === "Todas" ? "active" : ""}
                onClick={() => setSelectedCategory("Todas")}
              >
                Todas
              </Button>

              {categoriesArray.length > 0 ? (
                categoriesArray.map((cat) => (
                  <Button
                    key={cat._id}
                    className={selectedCategory === cat.name ? "active" : ""}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Button>
                ))
              ) : (
                <p>No hay categorías</p>
              )}
            </div>

            {/* 🔹 Nuevo: Filtro por país */}
            <div className="category-filter-bar country-filter-bar"> 
              {countryOptions.map((country) => (
                <Button
                  key={country}
                  className={selectedCountry === country ? "active" : ""}
                  onClick={() => setSelectedCountry(country)}
                >
                  {country}
                </Button>
              ))}
            </div>
            
          </div>

          {/* Lista de productos (sin cambios relevantes) */}
          <div className="products-list">
            {filteredProducts.length === 0 ? (
              <div className="no-products-message">
                <p>No hay productos disponibles.</p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                let medidas = {};
                if (product.measurements) {
                  if (typeof product.measurements === "string") {
                    try {
                      medidas = JSON.parse(product.measurements);
                    } catch (error) {
                      console.error("Error al parsear medidas:", error);
                    }
                  } else if (typeof product.measurements === "object") {
                    medidas = product.measurements;
                  }
                }

                return (
                  <div key={product._id} className="product-card">
                    <div className="product-info">
                      <h3 className="product-title">{product.name || "Sin nombre"}</h3>
                      {Array.isArray(product.images) && product.images.length > 0 ? (
                        <ImageSlider images={product.images} name={product.name} />
                      ) : (
                        <p className="no-image">Sin imagen</p>
                      )}
                    </div>

                    <p>Descripción: {product.description || "Sin descripción"}</p>
                    <p>
                      Precio:{" "}
                      {product.discountPercentage > 0 ? (
                        <>
                          <s>${product.price ?? "N/A"}</s> → <strong>${product.finalPrice ?? "N/A"}</strong>
                        </>
                      ) : (
                        <>${product.price ?? "N/A"}</>
                      )}
                    </p>
                    <p>Descuento: {product.discountPercentage ?? 0}%</p>
                    <p>Categoría: {product.category_id?.name || "Sin categoría"}</p>
                    {/* 🔹 Mostrar país */}
                    <p>País: {product.country ?? "No especificado"}</p>

                    <p
                      style={{
                        color:
                          product.stock === 0
                            ? "#dc3545"
                            : product.stock < 3
                            ? "#dc3545"
                            : product.stock <= 5
                            ? "#ffc107"
                            : "#222",
                        fontWeight: product.stock <= 5 ? "bold" : "normal",
                      }}
                    >
                      Stock: {product.stock ?? 0}
                    </p>

                    {medidas && (
                      <>
                        {medidas.weight && <p>Peso: {medidas.weight}</p>}
                        {medidas.height && <p>Altura: {medidas.height}</p>}
                        {medidas.width && <p>Ancho: {medidas.width}</p>}
                      </>
                    )}

                    <div className="product-actions">
                      <Button onClick={() => setEditingProductId(product._id)}>Editar</Button>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        style={{ backgroundColor: "#dc3545" }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {editingProductId && (
        <EditProduct
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;