// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
// 🔑 Importamos el CountryProvider
import { CountryProvider } from "./context/CountryContext.jsx"; 
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* 🔑 Envolvemos la App con el CountryProvider */}
      <CountryProvider>
        <App />
      </CountryProvider>
    </AuthProvider>
  </StrictMode>
);