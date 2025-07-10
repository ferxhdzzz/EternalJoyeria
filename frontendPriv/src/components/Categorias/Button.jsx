import React from "react";
import "./Button.css";

const Button = ({ text, type = "button" }) => {
  return (
    <button type={type} className="main-button">
      {text}
    </button>
  );
};

export default Button;
