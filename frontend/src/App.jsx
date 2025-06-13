import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import './App.css'; // Global styles

function App() {
  return (
    <Router>
      <Routes>
                <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
