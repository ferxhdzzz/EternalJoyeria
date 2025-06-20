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
import RegistroContainer from './pages/RegistroContainer';
import CartPage from './components/Cart/CartPage';
import HistorialPage from './pages/Historial';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';



// This is the main component of the application, which acts as a container for all other components.
function App() {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    <CartProvider>
      <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroContainer />} />


        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
                <Route path="/shop" element={<CartPage />} />
                  <Route path="/historial" element={<HistorialPage />} />
<Route path="/checkout" element={<CheckoutPage />} />

        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
      </Routes>
      </Router>
    </CartProvider>
  );
}

// Exports the App component to be used in other parts of the application, such as index.js.
export default App;
