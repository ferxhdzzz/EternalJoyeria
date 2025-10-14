// IMPORTACIONES NECESARIAS
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// HOOK PERSONALIZADO PARA OBTENER Y MANEJAR VENTAS
const useFetchSales = () => {
  // ESTADO PARA GUARDAR LAS VENTAS
  const [sales, setSales] = useState([]);
  // ESTADO PARA ALMACENAR LA LISTA DE CLIENTES ÚNICOS
  const [customers, setCustomers] = useState([]); 
  // ESTADO PARA INDICAR SI SE ESTÁ CARGANDO LA INFORMACIÓN
  const [loading, setLoading] = useState(false);

  // --- FUNCIÓN AUXILIAR PARA PROCESAR CLIENTES ÚNICOS ---
  const processCustomers = (salesData) => {
    const uniqueCustomers = new Map();

    salesData.forEach(sale => {
      const customer = sale.idOrder?.idCustomer;
      // Asegura que el cliente y su ID existan y que no haya sido agregado
      if (customer && customer._id && !uniqueCustomers.has(customer._id)) {
        uniqueCustomers.set(customer._id, {
          _id: customer._id,
          fullName: `${customer.firstName} ${customer.lastName}`.trim(),
        });
      }
    });

    // Convierte el Map a Array y lo ordena por nombre completo
    return Array.from(uniqueCustomers.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
  };

  // FUNCIÓN PARA OBTENER TODAS LAS VENTAS
  const getSales = async () => {
    setLoading(true);

    // CONTROLADOR PARA CANCELAR LA PETICIÓN SI ES NECESARIO
    const controller = new AbortController();

    try {
      console.log("Haciendo fetch a sales...");

      // PETICIÓN GET A LA API DE VENTAS CON COOKIES INCLUIDAS
      const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/sales", {
        signal: controller.signal,  // Permite abortar la petición
        credentials: "include",     // Incluye cookies de sesión
      });

      // VALIDACIÓN DE RESPUESTA
      if (!response.ok) throw new Error("Error al obtener ventas");

      // PARSEO DE LA RESPUESTA
      const data = await response.json();
      console.log("Data recibida:", data);

      const salesArray = Array.isArray(data) ? data : [];
      
      // 1. Actualiza el estado de ventas
      setSales(salesArray); 
      
      // 2. Procesa y actualiza el estado de clientes para el filtro
      setCustomers(processCustomers(salesArray));

    } catch (error) {
      // SOLO MANEJA ERRORES QUE NO SEAN DE ABORTO DE PETICIÓN
      if (error.name !== "AbortError") {
        console.error("Error al obtener ventas:", error);
        toast.error("Error al obtener ventas");
        setSales([]); // Limpia las ventas en caso de error
        setCustomers([]); // Limpia los clientes
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
      const response = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/${id}`, {
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
  return { sales, loading, getSaleById, getSales, customers }; // <-- 'customers' añadido
};

export default useFetchSales;
