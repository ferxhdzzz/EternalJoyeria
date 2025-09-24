// src/components/ReviewLinearChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ReviewLinearChart = ({ reviews }) => {
  // 📊 Transformamos las reseñas al formato esperado
  const chartData = reviews.map((review, index) => ({
    id: index + 1,
    rating: review.rank,
    // Si tu backend tiene `createdAt`:
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString("es-ES")
      : `Reseña ${index + 1}`
  }));

  return (
    <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* 🔹 Muestra la fecha en el eje X */}
          <XAxis dataKey="date" />
          {/* 🔹 Rango fijo de 1 a 5 estrellas */}
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip
            formatter={(value) => `${value} ⭐`}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#FF69B4"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewLinearChart;
