import React from "react";
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

const data = [
  { mes: "Ene", ventas: 120 },
  { mes: "Feb", ventas: 200 },
  { mes: "Mar", ventas: 150 },
  { mes: "Abr", ventas: 280 },
  { mes: "May", ventas: 300 },
  { mes: "Jun", ventas: 260 },
  { mes: "Jul", ventas: 350 },
  { mes: "Ago", ventas: 400 },
  { mes: "Sep", ventas: 370 },
  { mes: "Oct", ventas: 420 },
  { mes: "Nov", ventas: 450 },
  { mes: "Dic", ventas: 500 },
];

const SalesChart = () => {
  return (
    <div className="sales-chart-container">
      <h2>Ventas totales de joyas por mes</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
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
