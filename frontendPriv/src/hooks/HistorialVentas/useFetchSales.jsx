import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useFetchSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSales = async () => {
    setLoading(true);
    const controller = new AbortController();
    try {
      console.log("Haciendo fetch a sales...");
      const response = await fetch("http://localhost:4000/api/sales", {
        signal: controller.signal,
        credentials: "include", // ← incluir cookies de sesión
      });
      if (!response.ok) throw new Error("Error al obtener ventas");
      const data = await response.json();
      console.log("Data recibida:", data);
      setSales(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error al obtener ventas:", error);
        toast.error("Error al obtener ventas");
        setSales([]);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  const getSaleById = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/sales/${id}`, {
        credentials: "include", // ← incluir cookies de sesión
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

  useEffect(() => {
    getSales();
  }, []);

  return { sales, loading, getSaleById, getSales };
};

export default useFetchSales;
