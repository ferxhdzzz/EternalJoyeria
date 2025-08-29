import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../../styles/DashboardCss/salesChart.css";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSalesValue, setTotalSalesValue] = useState(0);

  // Función para calcular ventas acumuladas
  const calculateCumulativeData = (monthlyData) => {
    let cumulative = 0;
    return monthlyData.map(month => {
      cumulative += month.ventas;
      return {
        ...month,
        ventasAcumuladas: cumulative
      };
    });
  };

  // Función para obtener datos del backend
  const fetchSalesData = async (year) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/sales/monthly?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Datos completos del backend:", result);
      
      if (result.success && result.data) {
        const dataWithCumulative = calculateCumulativeData(result.data);
        
        // Calcular total de ventas del año
        const totalYear = result.data.reduce((sum, month) => sum + (month.ventas || 0), 0);
        
        console.log("Datos del gráfico con acumuladas:", dataWithCumulative);
        setSalesData(dataWithCumulative);
        setTotalSalesValue(totalYear);
        setError(null);
      } else {
        throw new Error(result.message || 'Error al obtener datos');
      }
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Error al cargar los datos de ventas');
      // Datos de fallback en caso de error
      const fallbackData = [
        { mes: "Ene", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Feb", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Mar", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Abr", ventas: 0, ventasAcumuladas: 0 },
        { mes: "May", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Jun", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Jul", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Ago", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Sep", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Oct", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Nov", ventas: 0, ventasAcumuladas: 0 },
        { mes: "Dic", ventas: 0, ventasAcumuladas: 0 },
      ];
      setSalesData(fallbackData);
      setTotalSalesValue(0);
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

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Mes: ${label}`}</p>
          <p style={{ margin: 0, color: '#d14da0' }}>
            {`Ventas del mes: $${payload[0]?.value?.toLocaleString() || 0}`}
          </p>
          <p style={{ margin: 0, color: '#2563eb' }}>
            {`Total acumulado: $${payload[1]?.value?.toLocaleString() || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="sales-chart-container">
        <h2>Ventas totales de joyas por mes</h2>
        <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h2>Ventas de joyas - {selectedYear}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Total del año: <strong style={{ color: '#2563eb' }}>${totalSalesValue.toLocaleString()}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            style={{ padding: '5px 10px' }}
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
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

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Línea de ventas mensuales */}
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#d14da0"
            strokeWidth={3}
            activeDot={{ r: 6 }}
            name="Ventas mensuales"
          />
          
          {/* Línea de ventas acumuladas */}
          <Line
            type="monotone"
            dataKey="ventasAcumuladas"
            stroke="#2563eb"
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={{ r: 6 }}
            name="Total acumulado"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;