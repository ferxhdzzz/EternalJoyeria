// src/hooks/Products/useProducts.jsx
import { useState, useEffect, useCallback } from "react";
import { useCountry } from "../../context/CountryContext";

// Se asegura que la URL de la API termine sin una barra para construir URLs limpias
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/**
 * Hook para obtener productos basados en el país activo.
 * Se espera que el backend filtre los productos usando el parámetro 'country'.
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtiene el país activo del contexto (SV, US, etc.)
  const { country } = useCountry();  
  const activeCountry = country || 'SV'; // Por defecto a 'SV' si no hay contexto

  // Utilizamos useCallback para memoizar la función de carga, evitando warnings de linting en useEffect
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Iniciando carga de productos de: ${activeCountry}`);

      // Construcción de la URL con el filtro de país
      const url = `${API_URL}/products?country=${activeCountry}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión.");
      }

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      
      // 🔑 MEJORA CLAVE: Verifica si 'data' es un array (respuesta directa) 
      // o si contiene una propiedad 'products' (respuesta envuelta).
      const productsData = Array.isArray(data) ? data : data.products;
      
      if (!Array.isArray(productsData)) {
        throw new Error("Formato de datos de producto inválido recibido de la API.");
      }

      setProducts(productsData);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError(err.message || "Error desconocido al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCountry]); // Dependencia clave: `activeCountry`

  // Se ejecuta cada vez que el país activo cambia
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 

  // Función para forzar la recarga
  const refetch = () => fetchProducts();

  // Devuelve los estados y la función de recarga
  return { products, loading, error, refetch, activeCountry }; 
};

export default useProducts;