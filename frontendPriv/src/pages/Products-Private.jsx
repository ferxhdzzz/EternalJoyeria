import React, { useState } from "react";
import Titulo from "../components/Componte-hook/Titulos";
import SubTitulo from "../components/Componte-hook/SubTitulo";
import Button from "../components/Componte-hook/Button";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/TopBar/TopBar";

import EditProduct from "../hooks/Productos/EditProduct";
import "../Styles/PaginaProduct.css";
import { useDataProduct } from "../hooks/Productos/UseDataProduct";

const Products = () => {
  const { products, deleteProduct, fetchProducts } = useDataProduct();
  const [editingProductId, setEditingProductId] = useState(null);

  const closeModal = () => setEditingProductId(null);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este producto?");
    if (confirmDelete) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="products-container">
          <div className="products-header">
            <Titulo>Lista de Productos</Titulo>
            <SubTitulo>Administra tus productos fácilmente</SubTitulo>
          </div>

          <div className="products-list">
            {products.length === 0 ? (
              <div className="no-products-message">
                <p>No hay productos disponibles.</p>
              </div>
            ) : (
              products.map((product) => {
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
                    <h3>{product.name || "Sin nombre"}</h3>

                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name || "Producto"}
                        className="product-image"
                      />
                    ) : (
                      <p className="no-image">Sin imagen</p>
                    )}

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

                    <p
                      style={{
                        color:
                          product.stock === 0
                            ? "#dc3545"
                            : product.stock <= 5
                            ? "#ffc107"
                            : "white",
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
                      <Button onClick={() => setEditingProductId(product._id)}>
                        Editar
                      </Button>
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
          onClose={closeModal}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;
