import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchCategories = () => {
  // Estados para la lista de categorías
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL del backend (misma que en AuthContext)
  const BACKEND_URL = 'http://192.168.1.200:4000';

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories`, {
        credentials: 'include', // Importante para enviar cookies
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.categories) {
        // Agregar categoría "Todos" al inicio
        const allCategories = [
          { _id: 'todos', name: 'Todos', description: 'Todos los productos' },
          ...data.categories
        ];
        setCategories(allCategories);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setError(error.message);
      
      // Mostrar alerta al usuario
      Alert.alert(
        "Error",
        "No se pudieron cargar las categorías. Verifica tu conexión.",
        [
          { text: "Reintentar", onPress: fetchCategories },
          { text: "OK", style: "cancel" }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar categorías
  const refreshCategories = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    refreshCategories,
  };
};

export default useFetchCategories;
