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
  const [totalSalesCount, setTotalSalesCount] = useState(0);

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

  // Función para obtener el total de ventas del dashboard
  const fetchDashboardSalesCount = async () => {
    try {
      const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/sales", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const salesData = await response.json();
        return salesData.length;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching dashboard sales count:', error);
      return 0;
    }
  };

  // Función para obtener datos del backend
  const fetchSalesData = async (year) => {
    try {
      setLoading(true);
      
      // Obtener datos mensuales de ventas (valor monetario)
      const monthlyResponse = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales/monthly?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      // Obtener todas las ventas
      const allSalesResponse = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/sales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!monthlyResponse.ok) {
        throw new Error(`Error: ${monthlyResponse.status} ${monthlyResponse.statusText}`);
      }

      const monthlyResult = await monthlyResponse.json();
      const allSalesResult = await allSalesResponse.json();
      
      console.log("Datos mensuales del backend:", monthlyResult);
      console.log("Total de ventas del backend:", allSalesResult?.length);
      
      if (monthlyResult.success && monthlyResult.data) {
        // Calcular cantidad de ventas por mes del año seleccionado
        const salesCountByMonth = {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
          7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
        };
        
        let totalSalesYearCount = 0;
        
        if (allSalesResult && Array.isArray(allSalesResult)) {
          allSalesResult.forEach((sale, index) => {
            // Intentar diferentes campos de fecha posibles
            const possibleDateFields = ['fecha', 'createdAt', 'date', 'created_at', 'fechaVenta', 'fecha_venta', 'updatedAt'];
            let saleDate = null;
            
            for (let field of possibleDateFields) {
              if (sale[field]) {
                try {
                  saleDate = new Date(sale[field]);
                  if (!isNaN(saleDate.getTime())) {
                    console.log(`Venta ${index + 1} - Campo '${field}':`, sale[field], "-> Fecha:", saleDate.toISOString().split('T')[0]);
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            
            if (saleDate && !isNaN(saleDate.getTime())) {
              const saleYear = saleDate.getFullYear();
              
              if (saleYear === year) {
                const month = saleDate.getMonth() + 1;
                salesCountByMonth[month]++;
                totalSalesYearCount++;
                console.log(`✓ Venta del año ${year} - Mes: ${month}, Total: ${totalSalesYearCount}`);
              }
            } else {
              console.warn(`⚠️ No se pudo determinar fecha para la venta ${index + 1}:`, Object.keys(sale));
            }
          });
        }

        console.log(`📊 Resumen detallado del año ${year}:`);
        console.log("- Distribución por meses:");
        Object.entries(salesCountByMonth).forEach(([month, count]) => {
          if (count > 0) {
            const monthNames = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            console.log(`  ${monthNames[month]}: ${count} ventas`);
          }
        });
        console.log(`- Total ventas del año ${year}: ${totalSalesYearCount}`);
        console.log(`- Total ventas general: ${allSalesResult?.length || 0}`);

        // Combinar datos de valor monetario con cantidad de ventas
        const enrichedData = monthlyResult.data.map((monthData, index) => {
          const monthNumber = index + 1;
          const count = salesCountByMonth[monthNumber] || 0;
          
          return {
            ...monthData,
            cantidadVentas: count
          };
        });

        const dataWithCumulative = calculateCumulativeData(enrichedData);
        
        // Calcular totales
        const totalYearValue = monthlyResult.data.reduce((sum, month) => sum + (month.ventas || 0), 0);
        
        console.log("📈 Datos finales para el gráfico:", dataWithCumulative);
        
        setSalesData(dataWithCumulative);
        setTotalSalesValue(totalYearValue);
        
        // Si estamos en el año actual, mostrar el total general
        // Si es un año específico, mostrar solo las ventas de ese año
        const currentYear = new Date().getFullYear();
        if (year === currentYear) {
          setTotalSalesCount(allSalesResult?.length || 0);
        } else {
          setTotalSalesCount(totalSalesYearCount);
        }
        
        setError(null);
      } else {
        throw new Error(monthlyResult.message || 'Error al obtener datos');
      }
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Error al cargar los datos de ventas');
      
      // En caso de error, obtener al menos el total del dashboard
      const dashboardTotal = await fetchDashboardSalesCount();
      
      // Datos de fallback
      const fallbackData = [
        { mes: "Ene", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Feb", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Mar", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Abr", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "May", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Jun", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Jul", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Ago", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Sep", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Oct", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Nov", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
        { mes: "Dic", ventas: 0, ventasAcumuladas: 0, cantidadVentas: 0 },
      ];
      setSalesData(fallbackData);
      setTotalSalesValue(0);
      setTotalSalesCount(dashboardTotal);
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
            {`Valor del mes: $${payload[0]?.value?.toLocaleString() || 0}`}
          </p>
          <p style={{ margin: 0, color: '#2563eb' }}>
            {`Total acumulado: $${payload[1]?.value?.toLocaleString() || 0}`}
          </p>
          <p style={{ margin: 0, color: '#10b981' }}>
            {`Cantidad de ventas: ${payload[2]?.value || 0}`}
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

  const currentYear = new Date().getFullYear();
  const isCurrentYear = selectedYear === currentYear;

  return (
    <div className="sales-chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h2>Ventas de joyas - {selectedYear}</h2>
          <div style={{ fontSize: '14px', color: '#666', display: 'flex', gap: '20px' }}>
            <p style={{ margin: 0 }}>
              {isCurrentYear ? 'Total de ventas' : `Ventas en ${selectedYear}`}: 
              <strong style={{ color: '#9333ea' }}> {totalSalesCount}</strong>
            </p>
            <p style={{ margin: 0 }}>
              Valor total: <strong style={{ color: '#a855f7' }}>${totalSalesValue.toLocaleString()}</strong>
            </p>
          </div>
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
          {error} {isCurrentYear && '(Mostrando total del dashboard)'}
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', height: '320px' }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Línea de ventas mensuales (valor monetario) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ventas"
              stroke="#c084fc"
              strokeWidth={3}
              activeDot={{ r: 7, fill: '#c084fc', stroke: '#9333ea', strokeWidth: 2 }}
              name="Valor mensual ($)"
            />
            
            {/* Línea de ventas acumuladas (valor monetario) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ventasAcumuladas"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              activeDot={{ r: 6, fill: '#a855f7', stroke: '#7c3aed', strokeWidth: 2 }}
              name="Total acumulado ($)"
            />
            
            {/* Línea de cantidad de ventas */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cantidadVentas"
              stroke="#e879f9"
              strokeWidth={2}
              activeDot={{ r: 6, fill: '#e879f9', stroke: '#d946ef', strokeWidth: 2 }}
              name="Cantidad de ventas"
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Indicador de total de ventas dentro de la gráfica */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'linear-gradient(135deg, rgba(196, 132, 252, 0.1) 0%, rgba(232, 121, 249, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '14px 18px',
          borderRadius: '16px',
          border: '1px solid rgba(196, 132, 252, 0.3)',
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.12)',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          <div style={{ color: '#9333ea', marginBottom: '6px', fontSize: '15px' }}>
            {isCurrentYear ? 'Total ventas' : `Ventas ${selectedYear}`}: {totalSalesCount}
          </div>
          <div style={{ color: '#a855f7', fontSize: '13px', fontWeight: 'normal' }}>
            ${totalSalesValue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;