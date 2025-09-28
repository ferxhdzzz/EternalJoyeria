import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import DashboardCard from "../components/DashboardCompt/DashboardCard";
import CategoryList from "../components/DashboardCompt/CategoryList";
import SalesChart from "../components/DashboardCompt/SalesChart";
import "../styles/DashboardCss/dashboard.css";
import useDataCategorias from "../hooks/Categorias/useDataCategorias";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const { categories, getCategories } = useDataCategorias();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, productsRes, salesRes] = await Promise.all([
          fetch("https://eternaljoyeria-cg5d.onrender.com/api/customers", { credentials: "include" }),
          fetch("https://eternaljoyeria-cg5d.onrender.com/api/products", { credentials: "include" }),
          fetch("https://eternaljoyeria-cg5d.onrender.com/api/sales", { credentials: "include" }),
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
    getCategories();
  }, []);

  return (
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
          <CategoryList categories={categories} />
          <SalesChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
