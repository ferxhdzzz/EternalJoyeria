// IMPORTACIONES NECESARIAS
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// CONSTANTE CON LA URL BASE DE LA API DE PRODUCTOS
const API_URL = "http://localhost:4000/api/products";

// HOOK PERSONALIZADO PARA GESTIONAR PRODUCTOS
export const useDataProduct = () => {
  // ESTADO PARA GUARDAR LA LISTA DE PRODUCTOS
  const [products, setProducts] = useState([]);
  // ESTADO PARA GUARDAR EL PRODUCTO SELECCIONADO
  const [selectedProduct, setSelectedProduct] = useState(null);

  // FUNCIÓN PARA OBTENER TODOS LOS PRODUCTOS DESDE LA API
  const fetchProducts = async () => {
    try {
      // PETICIÓN GET A LA API CON COOKIES INCLUIDAS
      const { data } = await axios.get(API_URL, {
        withCredentials: true,
      });
      // ACTUALIZAR EL ESTADO CON LOS PRODUCTOS OBTENIDOS
      setProducts(data);
    } catch (error) {
      // EN CASO DE ERROR, OBTENER MENSAJE Y MOSTRAR ALERTA
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al obtener productos",
        text: message,
        confirmButtonColor: "#d6336c"
      });
    }
  };

  // FUNCIÓN PARA ELIMINAR UN PRODUCTO POR SU ID
  const deleteProduct = async (id) => {
    try {
      // PETICIÓN DELETE A LA API CON COOKIES
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      // ALERTA DE ÉXITO
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El producto se eliminó correctamente.",
        confirmButtonColor: "#d6336c"
      });

      // VOLVER A OBTENER LOS PRODUCTOS PARA ACTUALIZAR EL ESTADO
      fetchProducts();
    } catch (error) {
      // MANEJO DE ERRORES CON ALERTA
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: message,
        confirmButtonColor: "#d6336c"
      });
    }
  };

  // FUNCIÓN PARA ACTUALIZAR UN PRODUCTO POR SU ID Y DATOS NUEVOS
  const updateProduct = async (id, updatedData) => {
    try {
      // CREAR FORM DATA PARA ENVIAR ARCHIVOS Y DATOS MIXTOS
      const formData = new FormData();

      // RECORRER LOS CAMPOS DEL OBJETO updatedData
      for (const key in updatedData) {
        if (key === "images" && Array.isArray(updatedData.images)) {
          // SI ES EL CAMPO IMÁGENES, AGREGAR CADA ARCHIVO INDIVIDUALMENTE
          updatedData.images.forEach((image) => formData.append("images", image));
        } else {
          // SI NO, AGREGAR EL VALOR NORMAL
          formData.append(key, updatedData[key]);
        }
      }

      // PETICIÓN PUT A LA API PARA ACTUALIZAR EL PRODUCTO
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // ALERTA DE ÉXITO
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El producto se actualizó correctamente.",
        confirmButtonColor: "#d6336c"
      });

      // ACTUALIZAR LA LISTA DE PRODUCTOS DESPUÉS DE LA ACTUALIZACIÓN
      fetchProducts();
    } catch (error) {
      // MANEJO DE ERRORES CON ALERTA
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: message,
        confirmButtonColor: "#d6336c"
      });
    }
  };

  // FUNCIÓN PARA CREAR UN NUEVO PRODUCTO CON LOS DATOS PROPORCIONADOS
  const createProduct = async (productData) => {
    try {
      // CREAR FORM DATA PARA ENVIAR ARCHIVOS Y DATOS MIXTOS
      const formData = new FormData();

      // RECORRER LOS CAMPOS DEL OBJETO productData
      for (const key in productData) {
        if (key === "images" && Array.isArray(productData.images)) {
          // SI ES EL CAMPO IMÁGENES, AGREGAR CADA ARCHIVO INDIVIDUALMENTE
          productData.images.forEach((image) => formData.append("images", image));
        } else {
          // SI NO, AGREGAR EL VALOR NORMAL
          formData.append(key, productData[key]);
        }
      }

      // PETICIÓN POST A LA API PARA CREAR EL PRODUCTO
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // ALERTA DE ÉXITO
      Swal.fire({
        icon: "success",
        title: "Producto creado",
        text: "El producto se agregó correctamente.",
        confirmButtonColor: "#d6336c"
      });

      // ACTUALIZAR LA LISTA DE PRODUCTOS DESPUÉS DE LA CREACIÓN
      fetchProducts();
    } catch (error) {
      // MANEJO DE ERRORES CON ALERTA
      const message = error?.response?.data?.message || error.message || "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: message,
        confirmButtonColor: "#d6336c"
      });
    }
  };

  // USEEFFECT PARA CARGAR LOS PRODUCTOS CUANDO EL COMPONENTE SE MONTA
  useEffect(() => {
    fetchProducts();
  }, []);

  // RETORNA LOS ESTADOS Y FUNCIONES QUE SE USARÁN EN EL COMPONENTE
  return {
    products,
    selectedProduct,
    setSelectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  };
};
