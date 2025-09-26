import { useState, useEffect } from 'react';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las categorías desde el backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando categorías desde API...');
      
      // Reemplaza apiFetch por fetch directamente
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Esto asegura que las cookies de sesión se envíen
      });

      // Verificamos si la respuesta es exitosa
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Detectar si data es un array o un objeto con categories
      const categoriesArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
        ? data.categories
        : [];

      console.log('Categorías cargadas exitosamente:', categoriesArray.length, 'categorías');
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);

      let errorMessage = 'Error desconocido al cargar categorías';
      if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Hook useEffect para cargar las categorías al inicio
  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para hacer un "refetch" o recarga manual de las categorías
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Asegura que las cookies de sesión se incluyan
      });

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
      console.error('Error refetching categories:', error);
      setError(error?.message || 'Error al recargar categorías');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
};

export default useCategories;
