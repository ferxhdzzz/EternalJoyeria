import React from "react";
import "./Logo.css";
import { NavLink } from 'react-router-dom';

const Logo = () => {
  return (
<NavLink to="/">

    <img src="/Products/EternalLogo.png" alt="Eternal Logo" className="logo" />
     </NavLink>
  );
};

export default Logo;

 