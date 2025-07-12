import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import DashboardCard from "../components/DashboardCompt/DashboardCard";
import CategoryList from "../components/DashboardCompt/CategoryList";
import SalesChart from "../components/DashboardCompt/SalesChart";
import "../styles/DashboardCss/dashboard.css";

const Dashboard = () => {
  // Estados para guardar los totales que se mostrarán en el dashboard
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener los datos de clientes, productos y ventas
    const fetchDashboardData = async () => {
      try {
        // Peticiones simultáneas para obtener los datos
        const [customersRes, productsRes, salesRes] = await Promise.all([
          fetch("http://localhost:4000/api/customers", { credentials: "include" }),
          fetch("http://localhost:4000/api/products", { credentials: "include" }),
          fetch("http://localhost:4000/api/sales", { credentials: "include" }),
        ]);

        // Parsear las respuestas a JSON
        const customersData = await customersRes.json();
        const productsData = await productsRes.json();
        const salesData = await salesRes.json();

        // Actualizar los estados con las cantidades recibidas (longitudes de arrays)
        setTotalCustomers(customersData.length);
        setTotalProducts(productsData.length);
        setTotalSales(salesData.length);
      } catch (error) {
        // En caso de error, mostrarlo en consola
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    // Ejecutar la función de carga de datos
    fetchDashboardData();
  }, []); // Se ejecuta solo una vez al montar

  return (
    <>
      <div className="dashboard-container">
        {/* Barra lateral con menú */}
        <Sidebar />

        {/* Barra superior */}
        <div className="topbar-wrapper">
          <TopBar />
        </div>

        {/* Contenido principal del dashboard */}
        <div className="main-content">
          {/* Contenedor de las tarjetas con los totales */}
          <div className="cards-container3">
            <DashboardCard
              value={totalCustomers}
              label="Total de Clientes"
              img="/Products/clientesDash.png"
            />
            <DashboardCard
              value={totalProducts}
              label="Total de productos"
              img="/Products/logo-productos.png"
            />
            <DashboardCard
              value={totalSales}
              label="Total de ventas"
              img="/Products/total-de-ventas-logo.png"
            />
          </div>

          {/* Sección inferior con lista de categorías y gráfico de ventas */}
          <div className="bottom-section">
            <CategoryList />
            <SalesChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
