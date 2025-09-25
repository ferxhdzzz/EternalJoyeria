import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

const useFetchProducts = () => {
  // Estados para la lista de productos
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async (categoryId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = categoryId && categoryId !== 'todos'
        ? `${buildApiUrl(API_ENDPOINTS.PRODUCTS_BY_CATEGORY)}/${categoryId}`
        : buildApiUrl(API_ENDPOINTS.PRODUCTS);
      
      const response = await fetch(url, {
        credentials: 'include', // Importante para enviar cookies
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // El backend puede devolver directamente el array o dentro de un objeto
      // API devuelve array directo
      let productsArray;
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.success === false) {
        throw new Error(data.message || 'Error al cargar productos');
      } else {
        throw new Error('Formato de respuesta inválido');
      }
      
      setProductos(productsArray);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError(error.message);
      
      // Mostrar alerta al usuario
      Alert.alert(
        "Error",
        "No se pudieron cargar los productos. Verifica tu conexión.",
        [
          { text: "Reintentar", onPress: fetchProductos },
          { text: "OK", style: "cancel" }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar productos
  const refreshProductos = (categoryId = null) => {
    fetchProductos(categoryId);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    fetchProductos,
    refreshProductos,
  };
};

export default useFetchProducts;
