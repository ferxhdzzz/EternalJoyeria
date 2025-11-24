// src/App.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router } from "react-router-dom";

import { ProductProvider } from "./context/ProductContext.jsx";
import FloatingChatbot from "./components/FloatingChatbot.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Products from "./pages/Products.jsx";
import Profile from "./pages/Profile.jsx";
import Recuperacion from "./pages/RecuperacionContra.jsx";
import VerificarCodigo from "./pages/VerificarCodigo.jsx";
import Actualizacion from "./pages/CambiarCont.jsx";
import Login from "./pages/Login.jsx";
import Detalle from "./pages/DetallesOrden.jsx";
import RegistroContainer from "./pages/RegistroContainer.jsx";
import CartPage from "./components/Cart/CartPage.jsx";
import HistorialPage from "./pages/Historial.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import Contact from "./pages/ContactUs.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import CookiesPolicy from "./pages/CookiesPolicy.jsx";
import TermsPolicy from "./pages/TermsPolicy.jsx";
import PrivacyNotice from "./pages/PrivacyNotice.jsx";
import CategoriaCollares from "./pages/CategoriaCollares.jsx";
import CategoriaAretes from "./pages/CategoriaAretes.jsx";
import CategoriaConjuntos from "./pages/CategoriaConjuntos.jsx";
import CategoriaAnillos from "./pages/CategoriaAnillos.jsx";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes.jsx";
import Profiles from "./pages/Profiles.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Blog from "./pages/Blog.jsx";
import HistorialReviews from "./pages/HistReviews.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import Error404 from "./pages/Error404.jsx";
import PrivateRoute from "./components/PublicRoute.jsx";

import "./App.css";

// NEW imports
import { CountryProvider } from "./context/CountryContext.jsx";
import CountrySelectorModal from "./components/CountrySelectorModal.jsx";

// Router wrapper component
import { Routes, Route, Navigate } from "react-router-dom";

function GuardCambio({ children }) {
  const ok = typeof window !== "undefined" && sessionStorage.getItem("rp_verified") === "1";
  return ok ? children : <Navigate to="/recuperacion" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.email || null);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/cambiar" element={<GuardCambio><Actualizacion /></GuardCambio>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroContainer />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/historial/detalles/:orderId" element={<Detalle />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/categoria" element={<Products />} />
        <Route path="/categoria/collares" element={<CategoriaCollares />} />
        <Route path="/categoria/aretes" element={<CategoriaAretes />} />
        <Route path="/categoria/conjuntos" element={<CategoriaConjuntos />} />
        <Route path="/categoria/anillos" element={<CategoriaAnillos />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/perfil" element={<PrivateRoute><Profiles /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><HistorialPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/histReview" element={<PrivateRoute><HistorialReviews /></PrivateRoute>} />
        <Route path="/carrito" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/shop" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/contactanos" element={<Contact />} />
        <Route path="/detalle-producto/:id" element={<DetailProduct />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/terminos" element={<TermsPolicy />} />
        <Route path="/aviso-privacidad" element={<PrivacyNotice />} />
        <Route path="/faq" element={<PreguntasFrecuentes />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      {/* Persistente */}
      <FloatingChatbot userName={userName} />
    </Router>
  );
}

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50, easing: "ease-out", delay: 0 });
  }, []);

  return (
    // AuthProvider moved to main.jsx (avoid duplication)
    <CartProvider>
      <CountryProvider>
        <ProductProvider>
          <AppRoutes />
          <CountrySelectorModal />
        </ProductProvider>
      </CountryProvider>
    </CartProvider>
  );
}

export default App;
