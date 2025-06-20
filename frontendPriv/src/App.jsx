import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recuperacion from './pages/RecuperacionContra';
import Login from './pages/Login';
import Actualizacion from './pages/CambiarCont';
import Ajustes from './pages/Ajustes';




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
