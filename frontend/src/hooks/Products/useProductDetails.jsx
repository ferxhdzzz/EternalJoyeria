import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Si no hay productId, no hacer la petición
      if (!productId) {
        setLoading(false);
        setError('ID de producto requerido');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando detalles del producto:', productId);
        
        // Usar apiFetch para obtener el producto específico
        const data = await apiFetch(`/products/${productId}`, { 
          method: 'GET' 
        });
        
        console.log('Detalles del producto cargados:', data);
        setProduct(data);
        
      } catch (error) {
        console.error('Error fetching product details:', error);
        
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error desconocido al cargar el producto';
        
        if (error?.status === 401) {
          errorMessage = 'No autorizado - Inicia sesión para ver el producto';
        } else if (error?.status === 403) {
          errorMessage = 'Acceso denegado - No tienes permisos para ver este producto';
        } else if (error?.status === 404) {
          errorMessage = 'Producto no encontrado';
        } else if (error?.status >= 500) {
          errorMessage = 'Error del servidor - Intenta más tarde';
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Se ejecuta cada vez que cambia el productId

  // Función para refrescar el producto manualmente
  const refetch = async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch(`/products/${productId}`, { method: 'GET' });
      setProduct(data);
      setError(null);
    } catch (error) {
      console.error('Error refetching product details:', error);
      setError(error?.message || 'Error al recargar el producto');
    } finally {
      setLoading(false);
    }
  };

  return { 
    product, 
    loading, 
    error,
    refetch // Función adicional para recargar datos
  };
};

export default useProductDetails;