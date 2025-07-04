import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import DashboardCard from "../components/DashboardCompt/DashboardCard";
import CategoryList from "../components/DashboardCompt/CategoryList";
import SalesChart from "../components/DashboardCompt/SalesChart";
import "../styles/DashboardCss/dashboard.css";

const Dashboard = () => {
  return (

     < >
    <div className="dashboard-container">
      <Sidebar />
      <div className="topbar-wrapper">
        <TopBar />
      </div>

      <div className="main-content">
        <div className="cards-container3">
          <DashboardCard 
            value="240" 
            label="Total de Clientes" 
            img="/Products/clientesDash.png" 
          />
          <DashboardCard 
            value="40" 
            label="Total de productos" 
            img="/Products/logo-productos.png" 
          />
          <DashboardCard 
            value="520" 
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
