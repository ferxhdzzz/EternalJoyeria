// src/components/ReviewStats.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReviewStats = ({ stats }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  // Datos para la gráfica
  const chartData = {
    labels: ["⭐ 5", "⭐ 4", "⭐ 3", "⭐ 2", "⭐ 1"],
    datasets: [
      {
        label: "Reseñas",
        data: [
          ratingDistribution[5] || 0,
          ratingDistribution[4] || 0,
          ratingDistribution[3] || 0,
          ratingDistribution[2] || 0,
          ratingDistribution[1] || 0,
        ],
        backgroundColor: "rgba(255, 105, 180, 0.7)", // 🌸 Rosa
        borderColor: "rgba(255, 105, 180, 1)",
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 12, // ✅ más delgadas
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // ✅ hace que sean horizontales
    responsive: true,
    plugins: {
      legend: {
        display: false, // ocultamos la leyenda si no la necesitas
      },
      title: {
        display: true,
        text: "Distribución de reseñas",
        color: "#ff69b4",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#555",
        },
        grid: {
          color: "rgba(255, 105, 180, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#555",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="review-stats">
      <div className="stats-container">
        {/* Calificación promedio */}
        <div className="average-rating-section">
          <div className="average-rating-display">
            <span className="average-number">{averageRating}</span>
            <div className="average-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={star <= averageRating ? "#FFD700" : "#E0E0E0"}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="total-count">{totalReviews} reseñas</span>
          </div>
        </div>

        {/* ✅ Aquí va la gráfica */}
        <div className="rating-chart">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Información adicional */}
      <div className="stats-info">
        <div className="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
              10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 
              1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
          <span>Envío rápido y empaque seguro</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
