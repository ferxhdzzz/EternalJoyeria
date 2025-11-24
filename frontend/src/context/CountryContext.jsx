// src/context/CountryContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(null); 
  const [language, setLanguage] = useState("es");
  const [initialized, setInitialized] = useState(false);

  // Cargar país desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("site_country");
    if (saved) {
      setCountry(saved);
      setLanguage(saved === "US" ? "en" : "es");
    }
    setInitialized(true);
  }, []);

  const chooseCountry = (value) => {
    setCountry(value);
    setLanguage(value === "US" ? "en" : "es");
    localStorage.setItem("site_country", value);

    // Puedes disparar carga de productos dinámicos aquí si quieres
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        language,
        initialized,
        chooseCountry,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
