import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./EditDataProduct.css"; 

const EditProduct = ({ productId, onClose, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    finalPrice: "",
    discountPercentage: "",
    stock: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
          credentials: "include", // ← enviar cookies de sesión
        });
        if (!res.ok) throw new Error("Error al cargar el producto");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          finalPrice: data.finalPrice || "",
          discountPercentage: data.discountPercentage || "",
          stock: data.stock || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el producto");
      }
    };
    loadProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ← enviar cookies de sesión
        body: JSON.stringify(formData),
      });

      const resJson = await response.json();

      if (!response.ok) throw new Error(resJson.message || "Error al actualizar el producto");

      toast.success("Producto actualizado correctamente");

      await refreshProducts();
      onClose();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      toast.error("Error al actualizar el producto: " + err.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="edit-product-form">
        <h2>Editar Producto</h2>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Precio Final:
          <input
            type="number"
            name="finalPrice"
            value={formData.finalPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          % Descuento:
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
          />
        </label>
        <label>
          Stock:
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </label>
        <div className="modal-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
