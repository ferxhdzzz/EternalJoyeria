// src/components/CountrySelectorModal.jsx
import { useEffect, useState } from "react";
import { useCountry } from "../context/CountryContext.jsx";
import { translations } from "../i18n/Translations.js";

export default function CountrySelectorModal() {
  const { country, initialized, chooseCountry, language } = useCountry();
  
  // 1. Inicializamos 'show' en FALSE.
  const [show, setShow] = useState(false); 

  const welcomeText = translations[language]?.welcome || "¿Desde dónde nos visitas?";

  useEffect(() => {
    // Si el proceso de inicialización del contexto no ha terminado, salimos.
    if (!initialized) return;

    // 2. Si el país ya está guardado (el usuario ya seleccionó), mantenemos oculto.
    if (country) {
      setShow(false);
      return;
    }

    // 🎯 AJUSTA ESTE VALOR: Duración en milisegundos que es ligeramente mayor
    // que la duración de tu animación de carga. 2500ms (2.5 segundos) es un buen punto de partida.
    const animationDuration = 2500; 
    
    // 3. Establecer un temporizador para mostrar el modal después del retardo de la animación.
    const timer = setTimeout(() => {
        setShow(true); 
    }, animationDuration);

    // Función de limpieza para evitar fugas de memoria si el componente se desmonta.
    return () => clearTimeout(timer);

  }, [country, initialized]);
  
  // 4. Función para cerrar y seleccionar país
  const handleCountrySelect = (selectedCountry) => {
    chooseCountry(selectedCountry);
    // Ocultamos el modal solo después de que el usuario interactúa
    setShow(false); 
  };
  
  // Si no debemos mostrar el modal, retornamos null
  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>{welcomeText}</h2> 
        <p>Selecciona tu país para ver el catálogo y el idioma correctos.</p>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", justifyContent: "center" }}>
          <button style={btnPrimary} onClick={() => handleCountrySelect("SV")}>
            🇸🇻 El Salvador — Español
          </button>

          <button style={btnOutline} onClick={() => handleCountrySelect("US")}>
            🇺🇸 United States — English
          </button>
        </div>

        <small style={{ display: "block", marginTop: "1rem", color: "#666" }}>
          Puedes cambiar esta preferencia más adelante en el menú.
        </small>
      </div>
    </div>
  );
}

/* ===== ESTILOS (Sin cambios) ===== */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  // 💡 Recomendación: Aumenta este zIndex a un número muy alto para asegurar que esté por encima de todo.
  zIndex: 10000, 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const cardStyle = {
  width: "min(720px, 96%)",
  background: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  textAlign: "center",
};

const btnPrimary = {
  padding: "0.8rem 1rem",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: "#d95f7a",
  color: "white",
  fontWeight: 700,
};

const btnOutline = {
  padding: "0.8rem 1rem",
  borderRadius: "10px",
  border: "2px solid #d95f7a",
  cursor: "pointer",
  background: "transparent",
  color: "#333",
  fontWeight: 700,
};