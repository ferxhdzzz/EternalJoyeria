// src/context/CountryContext.jsx
import { createContext, useContext, useState } from "react";

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  // Inicializar el estado de 'country' con valor guardado o por defecto
  const getInitialCountry = () => {
    const savedCountry = localStorage.getItem("site_country");
    return savedCountry || 'SV';
  };

  const [country, setCountry] = useState(getInitialCountry);
  const [language, setLanguage] = useState(country === "US" ? "en" : "es");
  const [initialized] = useState(true); // siempre inicializado

  const chooseCountry = (value) => {
    setCountry(value);
    setLanguage(value === "US" ? "en" : "es");
    localStorage.setItem("site_country", value);
  };

  return (
    <CountryContext.Provider value={{ country, language, initialized, chooseCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
