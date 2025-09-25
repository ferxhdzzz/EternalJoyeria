// src/hooks/Products/useProducts.jsx
import { useState, useEffect } from "react";

// Base URL robusta:
// - Si VITE_API_URL está definida, úsala (debe terminar en /api).
// - Si no, en dev usa http://localhost:4000/api.
// - En prod, asume /api relativo.
const raw = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL =
  raw ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "/api");

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_URL}/products?hideFlagged=true`;
      console.log("[useProducts] GET:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Cinturón y tirantes: filtrar en cliente por si algo se cuela
      const filtered = Array.isArray(data)
        ? data.filter((p) => {
            const cond = String(p?.condition || "").toUpperCase();
            const flagged =
              p?.isDefectiveOrDeteriorated === true ||
              cond === "DEFECTUOSO" ||
              cond === "DETERIORADO";
            return !flagged;
          })
        : [];

      if (Array.isArray(data) && filtered.length !== data.length) {
        console.warn(
          "[useProducts] Se ocultaron",
          data.length - filtered.length,
          "producto(s) defectuoso(s)/deteriorado(s) en el cliente."
        );
      }

      console.log("[useProducts] cargados:", filtered.length, "productos");
      setProducts(filtered);
    } catch (err) {
      console.error("[useProducts] Error:", err);
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
