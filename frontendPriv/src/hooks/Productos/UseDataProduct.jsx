import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:4000/api/products";

export const useDataProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al obtener productos: ${message}`);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Producto eliminado correctamente");
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al eliminar producto: ${message}`);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        if (key === "images" && Array.isArray(updatedData.images)) {
          updatedData.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, updatedData[key]);
        }
      }

      await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Producto actualizado correctamente");
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al actualizar producto: ${message}`);
    }
  };

  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      for (const key in productData) {
        if (key === "images" && Array.isArray(productData.images)) {
          productData.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, productData[key]);
        }
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Producto creado exitosamente");
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al crear producto: ${message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    selectedProduct,
    setSelectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  };
};