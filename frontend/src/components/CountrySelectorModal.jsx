// src/components/CountrySelectorModal.jsx
import { useEffect, useState } from "react";
import { useCountry } from "../context/CountryContext.jsx";

import { translations } from "../i18n/Translations.js";

const { language } = useCountry();

<p>{translations[language].welcome}</p>

export default function CountrySelectorModal() {
  const { country, initialized, chooseCountry } = useCountry();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    if (!country) {
      setShow(true);   // Mostrar modal si no hay país seleccionado
    } else {
      setShow(false);  // Ocultar si ya se eligió
    }
  }, [country, initialized]);

  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>¿Desde dónde nos visitas?</h2>
        <p>Selecciona tu país para ver el catálogo y el idioma correctos.</p>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <button style={btnPrimary} onClick={() => chooseCountry("SV")}>
            🇸🇻 El Salvador — Español
          </button>

          <button style={btnOutline} onClick={() => chooseCountry("US")}>
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

/* ===== ESTILOS ===== */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 20000,
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
