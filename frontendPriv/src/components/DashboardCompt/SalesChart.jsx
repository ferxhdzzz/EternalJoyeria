import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "../../styles/DashboardCss/salesChart.css";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Función para obtener datos del backend
  const fetchSalesData = async (year) => {
    try {
      setLoading(true);
      //esta URL según tu configuración (puerto y ruta base)
      const response = await fetch(`http://localhost:4000/api/sales/monthly?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agrega headers de autenticación si es necesario
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSalesData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Error al obtener datos');
      }
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Error al cargar los datos de ventas');
      // Datos de fallback en caso de error
      setSalesData([
        { mes: "Ene", ventas: 0 },
        { mes: "Feb", ventas: 0 },
        { mes: "Mar", ventas: 0 },
        { mes: "Abr", ventas: 0 },
        { mes: "May", ventas: 0 },
        { mes: "Jun", ventas: 0 },
        { mes: "Jul", ventas: 0 },
        { mes: "Ago", ventas: 0 },
        { mes: "Sep", ventas: 0 },
        { mes: "Oct", ventas: 0 },
        { mes: "Nov", ventas: 0 },
        { mes: "Dic", ventas: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchSalesData(selectedYear);
  }, [selectedYear]);

  // Función para refrescar los datos
  const handleRefresh = () => {
    fetchSalesData(selectedYear);
  };

  // Función para cambiar el año
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  if (loading) {
    return (
      <div className="sales-chart-container">
        <h2>Ventas totales de joyas por mes</h2>
        <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Ventas totales de joyas por mes</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            style={{ padding: '5px 10px' }}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2023}>2023</option>
          </select>
          <button onClick={handleRefresh} style={{ padding: '5px 10px', cursor: 'pointer' }}>
            Actualizar
          </button>
        </div>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#d14da0"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;