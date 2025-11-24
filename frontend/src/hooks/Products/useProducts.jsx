// src/hooks/Products/useProducts.jsx
import { useState, useEffect } from "react";
import { useCountry } from "../../context/CountryContext";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const { country } = useCountry();  // ⬅ AQUÍ LEEMOS EL PAÍS

  const fetchProducts = async () => {
    if (!country) return; // evita cargar sin país

    try {
      setLoading(true);
      setError(null);

      console.log(`Cargando productos de país: ${country}`);

      const res = await fetch(`${API_URL}/products?country=${country}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // El backend devuelve products dentro de un objeto
      setProducts(data.products || []);
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
  }, [country]); // ⬅ SE RECARGA CUANDO EL USUARIO CAMBIA DE PAÍS

  const refetch = () => fetchProducts();

  return { products, loading, error, refetch };
};

export default useProducts;
