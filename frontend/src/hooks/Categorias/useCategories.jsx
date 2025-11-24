// src/hooks/Categorias/useCategories.jsx
import { useState, useEffect } from 'react';
import { useCountry } from '../../context/CountryContext';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { country } = useCountry(); // ⬅ Añadido

  const fetchCategories = async () => {
    if (!country) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://eternaljoyeria-cg5d.onrender.com/api/categories?country=${country}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      const categoriesArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
        ? data.categories
        : [];

      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error?.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [country]); // ⬅ Ahora sí cambia cuando el país cambia

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export default useCategories;
