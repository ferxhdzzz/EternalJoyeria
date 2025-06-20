import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "../TopBar/TopBar";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
