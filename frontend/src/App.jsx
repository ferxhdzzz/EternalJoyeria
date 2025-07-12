import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Recuperacion from './pages/RecuperacionContra';
import Actualizacion from './pages/CambiarCont';
import Login from './pages/Login';
import RegistroContainer from './pages/RegistroContainer';
import CartPage from './components/Cart/CartPage';
import HistorialPage from './pages/Historial';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import ContactUsPage from './pages/ContactUs';
import DetailProduct from './pages/DetailProduct';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import TermsPolicy from './pages/TermsPolicy';

import PublicRoute from './components/PublicRoute'; // 👈 Importa tu protector de rutas públicas

import './App.css'; // Global styles

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      easing: 'ease-out',
      delay: 0,
    });
  }, []);

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
          <Route path="/productos" element={<Products />} />
          <Route path="/categoria" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 🔒 Rutas públicas protegidas */}
          <Route
            path="/profile"
            element={
              <PublicRoute>
                <Profile />
              </PublicRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <PublicRoute>
                <Profile />
              </PublicRoute>
            }
          />

          <Route
            path="/historial"
            element={
              <PublicRoute>
                <HistorialPage />
              </PublicRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PublicRoute>
                <CheckoutPage />
              </PublicRoute>
            }
          />

          <Route path="/carrito" element={<CartPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<CartPage />} />
          <Route path="/contactanos" element={<ContactUsPage />} />
          <Route path="/detalle-producto/:id" element={<DetailProduct />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/terminos" element={<TermsPolicy />} />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
