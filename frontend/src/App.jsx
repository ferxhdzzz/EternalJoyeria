import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import './App.css'; // Global styles
import Recuperacion from './pages/RecuperacionContra';
import Actualizacion from './pages/CambiarCont';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Cart';
import Hitorial from './pages/Historial';
import Registro2 from './pages/Registro2';
import Registro3 from './pages/Registro3';



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/login" element={<Login />} />
             <Route path="/registro" element={<Registro />} />


        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
                <Route path="/shop" element={<Carrito />} />
                  <Route path="/historial" element={<Hitorial />} />
                   <Route path="/registro2" element={<Registro2 />} />
                                      <Route path="/registro3" element={<Registro3 />} />

        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
