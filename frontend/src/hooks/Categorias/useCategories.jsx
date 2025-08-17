import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Cargando categorías desde API...');

        const data = await apiFetch('/categories', { method: 'GET' });

        // Detectar si data es un array o un objeto con categories
        const categoriesArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
          ? data.categories
          : [];

        console.log(
          'Categorías cargadas exitosamente:',
          categoriesArray.length,
          'categorías'
        );

        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);

        let errorMessage = 'Error desconocido al cargar categorías';
        if (error?.status === 401) {
          errorMessage = 'No autorizado - Inicia sesión para ver las categorías';
        } else if (error?.status === 403) {
          errorMessage = 'Acceso denegado - No tienes permisos para ver las categorías';
        } else if (error?.status === 404) {
          errorMessage = 'Endpoint de categorías no encontrado';
        } else if (error?.status >= 500) {
          errorMessage = 'Error del servidor - Intenta más tarde';
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch('/categories', { method: 'GET' });
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
    refetch
  };
};

export default useCategories;
