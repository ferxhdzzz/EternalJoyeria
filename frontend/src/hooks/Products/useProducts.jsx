// src/hooks/Products/useProducts.jsx
import { useState, useEffect } from "react";

const raw = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL =
  raw ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "/api");

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usamos tu URL original con '?hideFlagged=true'
      const url = `${API_URL}/products?hideFlagged=true`;
      console.log("[useProducts] GET (original):", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      
      // Mantenemos tu filtro "cinturón y tirantes" por si acaso
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