import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RecuperacionContra from './pages/RecuperacionContra'; 
import CambiarCont from './pages/CambiarCont';              
import Dashboard from './pages/Dashboard';
import Ajustes from './pages/Ajustes';
import HistorialResenas from './pages/HistorialResenas';

import Categorias from './pages/Caterorias';
import VerificarCodigo from './pages/VerificarCodigo';


import Resenas from './pages/HistorialResenas';
import ProductPriv from './pages/Products-Private';
import AddProduct from './pages/AgregarProducto';
import HistoryShopping from './pages/HistorialCompras';

// Componente para proteger rutas
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas PÚBLICAS */}
        <Route path="/" element={<Home />} />


        {/* Auth Admin */}
        <Route path="/login" element={<Login />} />

        <Route path="/recuperacion" element={<RecuperacionContra />} />
        <Route path="/cambiar" element={<CambiarCont />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/cambiar" element={<CambiarCont />} />


        {/* Rutas PRIVADAS */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajustes"
          element={
            <ProtectedRoute>
              <Ajustes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resenas"
          element={
            <ProtectedRoute>
              <HistorialResenas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productPriv"
          element={
            <ProtectedRoute>
              <ProductPriv />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddProduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HistorialCompras"
          element={
            <ProtectedRoute>
              <HistoryShopping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <Categorias />
            </ProtectedRoute>
          }
        />
         
      </Routes>
    </Router>
  );
}

export default App;
