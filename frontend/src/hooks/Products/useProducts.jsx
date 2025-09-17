// src/hooks/Products/useProducts.jsx
import { useState, useEffect } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""); 
// Asegúrate de que VITE_API_URL termine con /api (ej: http://localhost:4000/api)

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Cargando productos desde API...");

      const res = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Productos cargados exitosamente:", data?.length || 0, "productos");
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => fetchProducts();

  return { products, loading, error, refetch };
};

export default useProducts;
