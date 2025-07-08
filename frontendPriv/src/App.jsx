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
import ProductsPrivate from './pages/Products-Private';
import AgregarProducto from './pages/AgregarProducto';
import HistorialCompras from './pages/HistorialCompras';
import Categorias from './pages/Caterorias';
import VerificarCodigo from './pages/VerificarCodigo';


// Componente para proteger rutas
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/loginAdmin" element={<Login/>} />
        <Route path="/recuperacion" element={<RecuperacionContra />} />
        <Route path="/cambiar" element={<CambiarCont />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/cambiar" element={<CambiarCont />} />


        {/* Rutas PRIVADAS */}
        <Route
          path="/dashboard"
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
          path="/productos"
          element={
            <ProtectedRoute>
              <ProductsPrivate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agregar-producto"
          element={
            <ProtectedRoute>
              <AgregarProducto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial-compras"
          element={
            <ProtectedRoute>
              <HistorialCompras />
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
