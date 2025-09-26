// src/hooks/Products/useProductDetails.jsx
import { useState, useEffect } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""); 
// Asegúrate de que VITE_API_URL termine con /api

const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchProductDetails = async () => {
    if (!productId) {
      setLoading(false);
      setError("ID de producto requerido");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Cargando detalles del producto:", productId);

      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("No autorizado - Inicia sesión para ver el producto");
        if (res.status === 403) throw new Error("Acceso denegado - No tienes permisos");
        if (res.status === 404) throw new Error("Producto no encontrado");
        if (res.status >= 500) throw new Error("Error del servidor - Intenta más tarde");
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Detalles del producto cargados:", data);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.message || "Error al cargar el producto");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const refetch = () => fetchProductDetails();

  return { product, loading, error, refetch };
};

export default useProductDetails;
