// hooks/useAddProduct.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useAddProduct() {
  const [loading, setLoading] = useState(false);

  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await axios.post("https://eternaljoyeria-cg5d.onrender.com/api/products", productData, {
        withCredentials: true,
      });
      toast.success("Producto agregado correctamente");
      return response.data;
    } catch (error) {
      toast.error("Error al agregar el producto");

      // ✅ Aquí está el log detallado del error
      console.error("Error al agregar producto:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading };
}
