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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Admin */}
        <Route path="/loginAdmin" element={<Login />} />
        <Route path="/recuperacion" element={<RecuperacionContra />} />
        <Route path="/cambiar" element={<CambiarCont />} />

        {/* Privado */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/resenas" element={<HistorialResenas />} />
        <Route path="/productos" element={<ProductsPrivate />} />
        <Route path="/agregar-producto" element={<AgregarProducto />} />
        <Route path="/historial-compras" element={<HistorialCompras />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </Router>
  );
}

export default App;
