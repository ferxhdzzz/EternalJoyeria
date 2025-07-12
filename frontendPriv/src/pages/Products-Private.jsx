import React, { useState } from "react";
import Swal from "sweetalert2"; // Para mostrar alertas bonitas
import Titulo from "../components/Componte-hook/Titulos"; // Componente título reutilizable
import SubTitulo from "../components/Componte-hook/SubTitulo"; // Componente subtítulo reutilizable
import Button from "../components/Componte-hook/Button"; // Botón reutilizable
import Sidebar from "../components/Sidebar/Sidebar"; // Sidebar de navegación
import Topbar from "../components/TopBar/TopBar"; // Barra superior

import EditProduct from "../hooks/Productos/EditProduct"; // Componente modal para editar producto
import "../Styles/PaginaProduct.css"; // Estilos de la página productos
import { useDataProduct } from "../hooks/Productos/UseDataProduct"; // Hook para manejar datos de productos
import ImageSlider from "../components/Componte-hook/ImageSlider"; // Componente para slider de imágenes

const Products = () => {
  // Extraemos productos, función para eliminar y recargar productos desde el hook
  const { products, deleteProduct, fetchProducts } = useDataProduct();
  // Estado para controlar qué producto está siendo editado (id)
  const [editingProductId, setEditingProductId] = useState(null);

  // Cierra el modal de edición (poniendo id en null)
  const closeModal = () => setEditingProductId(null);

  // Función para eliminar producto con confirmación SweetAlert
  const handleDelete = async (id) => {
    // Confirmación de eliminación
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
        // Intentamos eliminar el producto usando el hook
        await deleteProduct(id);
        // Mensaje éxito
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          text: "El producto fue eliminado correctamente.",
          confirmButtonColor: "#d6336c",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        // Mensaje error si falla
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
      {/* Sidebar de navegación */}
      <Sidebar />

      <div className="main-content">
        {/* Barra superior */}
        <div className="topbar-wrapper">
          <Topbar />
        </div>

        {/* Contenedor principal de productos */}
        <div className="products-container">
          {/* Encabezado con título y subtítulo */}
          <div className="products-header">
            <Titulo>Lista de Productos</Titulo>
            <SubTitulo>Administra tus productos fácilmente</SubTitulo>
          </div>

          {/* Lista de productos o mensaje si no hay */}
          <div className="products-list">
            {products.length === 0 ? (
              <div className="no-products-message">
                <p>No hay productos disponibles.</p>
              </div>
            ) : (
              products.map((product) => {
                // Parseamos las medidas si vienen en string o ya objeto
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
                      {/* Nombre del producto o texto por defecto */}
                      <h3 className="product-title">{product.name || "Sin nombre"}</h3>

                      {/* Slider de imágenes si hay, sino texto */}
                      {Array.isArray(product.images) && product.images.length > 0 ? (
                        <ImageSlider images={product.images} name={product.name} />
                      ) : (
                        <p className="no-image">Sin imagen</p>
                      )}
                    </div>

                    {/* Descripción del producto */}
                    <p>Descripción: {product.description || "Sin descripción"}</p>

                    {/* Precio con descuento si aplica */}
                    <p>
                      Precio:{" "}
                      {product.discountPercentage > 0 ? (
                        <>
                          <s>${product.price ?? "N/A"}</s> →{" "}
                          <strong>${product.finalPrice ?? "N/A"}</strong>
                        </>
                      ) : (
                        <>${product.price ?? "N/A"}</>
                      )}
                    </p>

                    {/* Porcentaje de descuento */}
                    <p>Descuento: {product.discountPercentage ?? 0}%</p>
                    {/* Categoría del producto */}
                    <p>Categoría: {product.category_id?.name || "Sin categoría"}</p>

                    {/* Stock con colores según cantidad */}
                    <p
                      style={{
                        color:
                          product.stock === 0
                            ? "#dc3545" // rojo si no hay stock
                            : product.stock <= 5
                            ? "#ffc107" // amarillo si hay poco stock
                            : "white",
                        fontWeight: product.stock <= 5 ? "bold" : "normal",
                      }}
                    >
                      Stock: {product.stock ?? 0}
                    </p>

                    {/* Mostrar medidas si existen */}
                    {medidas && (
                      <>
                        {medidas.weight && <p>Peso: {medidas.weight}</p>}
                        {medidas.height && <p>Altura: {medidas.height}</p>}
                        {medidas.width && <p>Ancho: {medidas.width}</p>}
                      </>
                    )}

                    {/* Botones para editar o eliminar producto */}
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

      {/* Modal de edición de producto si hay producto seleccionado */}
      {editingProductId && (
        <EditProduct
          productId={editingProductId}
          onClose={closeModal}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;
