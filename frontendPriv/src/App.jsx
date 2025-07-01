import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recuperacion from './pages/RecuperacionContra';
import Login from './pages/Login';
import Actualizacion from './pages/CambiarCont';
import Ajustes from './pages/Ajustes';
import Resenas from './pages/HistorialResenas';
import ProductPriv from './pages/Products-Private';
import AddProduct from './pages/AgregarProducto'
import HistoryShopping from './pages/HistorialCompras'
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Caterorias';


function App() {


  return (
    <>
      <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/resenas" element={<Resenas />} />
          <Route path="/productPriv" element={<ProductPriv />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/HistorialCompras" element={<HistoryShopping />} />
          <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/categorias" element={<Categorias />} />





          {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
        </Routes>
      </Router>
    </>
  )
}

export default App
