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




// This is the main component of the application, which acts as a container for all other components.
function App() {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // The Router component provides the routing context for the application.
    <Router>
      {/* The Routes component is a container for a collection of Route components. */}
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
        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
      </Routes>
    </Router>
  );
}

// Exports the App component to be used in other parts of the application, such as index.js.
export default App;
