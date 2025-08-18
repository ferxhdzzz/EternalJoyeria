import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando productos desde API...');
        
        // Usar apiFetch que ya maneja la autenticación automáticamente
        const data = await apiFetch('/products', { 
          method: 'GET' 
        });
        
        console.log('Productos cargados exitosamente:', data?.length || 0, 'productos');
        setProducts(data || []);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error desconocido al cargar productos';
        
        if (error?.status === 401) {
          errorMessage = 'No autorizado - Inicia sesión para ver los productos';
        } else if (error?.status === 403) {
          errorMessage = 'Acceso denegado - No tienes permisos para ver los productos';
        } else if (error?.status === 404) {
          errorMessage = 'Endpoint de productos no encontrado';
        } else if (error?.status >= 500) {
          errorMessage = 'Error del servidor - Intenta más tarde';
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setProducts([]); // Array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Sin dependencias ya que apiFetch maneja la autenticación internamente

  // Función para refrescar productos manualmente
  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch('/products', { method: 'GET' });
      setProducts(data || []);
      setError(null);
    } catch (error) {
      console.error('Error refetching products:', error);
      setError(error?.message || 'Error al recargar productos');
    } finally {
      setLoading(false);
    }
  };

  return { 
    products, 
    loading, 
    error,
    refetch // Función adicional para recargar datos
  };
};

export default useProducts;