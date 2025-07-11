import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import DashboardCard from "../components/DashboardCompt/DashboardCard";
import CategoryList from "../components/DashboardCompt/CategoryList";
import SalesChart from "../components/DashboardCompt/SalesChart";
import "../styles/DashboardCss/dashboard.css";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, productsRes, salesRes] = await Promise.all([
          fetch("http://localhost:4000/api/customers"),
          fetch("http://localhost:4000/api/products"),
          fetch("http://localhost:4000/api/sales")
        ]);

        const customersData = await customersRes.json();
        const productsData = await productsRes.json();
        const salesData = await salesRes.json();

        setTotalCustomers(customersData.length);
        setTotalProducts(productsData.length);
        setTotalSales(salesData.length);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="topbar-wrapper">
          <TopBar />
        </div>

        <div className="main-content">
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
