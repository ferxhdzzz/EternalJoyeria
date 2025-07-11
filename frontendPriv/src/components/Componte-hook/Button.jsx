import React from "react";

const Button = ({ type = "button", children, className, onClick }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

