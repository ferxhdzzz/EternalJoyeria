import { useState, useEffect } from 'react';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.PRODUCTS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener producto por ID
  const fetchProductById = async (productId) => {
    try {
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.PRODUCTS)}/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const product = await response.json();
      return { success: true, product };
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      return { success: false, error: err.message };
    }
  };

  // Obtener productos por categoria
  const fetchProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.PRODUCTS_BY_CATEGORY)}/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err.message || 'Error al cargar productos por categoría');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    refetch: fetchProducts
  };
};

export default useProducts;
