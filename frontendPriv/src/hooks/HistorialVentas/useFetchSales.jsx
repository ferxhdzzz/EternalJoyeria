// IMPORTACIONES NECESARIAS
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// HOOK PERSONALIZADO PARA OBTENER Y MANEJAR VENTAS
const useFetchSales = () => {
  // ESTADO PARA GUARDAR LAS VENTAS
  const [sales, setSales] = useState([]);
  // ESTADO PARA INDICAR SI SE ESTÁ CARGANDO LA INFORMACIÓN
  const [loading, setLoading] = useState(false);

  // FUNCIÓN PARA OBTENER TODAS LAS VENTAS
  const getSales = async () => {
    setLoading(true);

    // CONTROLADOR PARA CANCELAR LA PETICIÓN SI ES NECESARIO
    const controller = new AbortController();

    try {
      console.log("Haciendo fetch a sales...");

      // PETICIÓN GET A LA API DE VENTAS CON COOKIES INCLUIDAS
      const response = await fetch("http://localhost:4000/api/sales", {
        signal: controller.signal,  // Permite abortar la petición
        credentials: "include",     // Incluye cookies de sesión
      });

      // VALIDACIÓN DE RESPUESTA
      if (!response.ok) throw new Error("Error al obtener ventas");

      // PARSEO DE LA RESPUESTA
      const data = await response.json();
      console.log("Data recibida:", data);

      // ACTUALIZA EL ESTADO DE VENTAS, ASEGURANDO QUE SEA UN ARRAY
      setSales(Array.isArray(data) ? data : []);
    } catch (error) {
      // SOLO MANEJA ERRORES QUE NO SEAN DE ABORTO DE PETICIÓN
      if (error.name !== "AbortError") {
        console.error("Error al obtener ventas:", error);
        toast.error("Error al obtener ventas");
        setSales([]); // Limpia las ventas en caso de error
      }
    } finally {
      setLoading(false);
    }

    // RETORNA UNA FUNCION PARA ABORTAR LA PETICIÓN SI EL COMPONENTE SE DESTRUYE
    return () => controller.abort();
  };

  // FUNCIÓN PARA OBTENER UNA VENTA POR SU ID
  const getSaleById = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/sales/${id}`, {
        credentials: "include", // Incluye cookies de sesión
      });

      if (!response.ok) throw new Error("Error al obtener venta por ID");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener venta:", error);
      toast.error("Error al obtener venta");
      return null;
    }
  };

  // USEEFFECT PARA EJECUTAR getSales AL MONTAJE DEL COMPONENTE
  useEffect(() => {
    getSales();
  }, []);

  // RETORNA LOS DATOS Y FUNCIONES NECESARIAS PARA EL COMPONENTE
  return { sales, loading, getSaleById, getSales };
};

export default useFetchSales;
