import React, { useState } from "react";
import { LockIcon, CheckIcon, XIcon, HistoryIcon } from "lucide-react";

const Profile = () => {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const [profile, setProfile] = useState({
    name: "Fernanda Hernández",
    email: "ferhernandez@gmail.com",
    phone: "7776-2920",
  });

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(profile[field]);
  };

  const handleSaveEdit = (field) => {
    setProfile((prev) => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") handleSaveEdit(field);
    if (e.key === "Escape") handleCancelEdit();
  };

  const handleLogout = () => {
    alert("Sesión cerrada"); // aquí va tu lógica de logout
  };

  const renderField = (field, label, value, isPassword = false) => {
    if (isPassword) {
      return (
        <div
          className="profile-info-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <div
              className="profile-info-label"
              style={{ fontWeight: 500, fontSize: 14 }}
            >
              {label}
            </div>
          </div>
          <button
            className="edit-btn"
            style={{
              background: "#eab5c5",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => (window.location.href = "/recuperacion")}
          >
            <LockIcon size={14} color="white" /> Cambiar contraseña
          </button>
        </div>
      );
    }

    const isEditing = editingField === field;
    return (
      <div
        className="profile-info-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            className="profile-info-label"
            style={{ fontWeight: 500, fontSize: 14 }}
          >
            {label}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, field)}
              style={{
                border: "2px solid #F0EFFA",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "15px",
                fontWeight: "600",
              }}
              autoFocus
            />
          ) : (
            <div
              className="profile-info-value"
              style={{ fontWeight: 700, fontSize: 15 }}
            >
              {value}
            </div>
          )}
        </div>
        {isEditing ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="edit-btn"
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "4px 12px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={() => handleSaveEdit(field)}
            >
              <CheckIcon size={12} color="white" />
            </button>
            <button
              className="edit-btn"
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "4px 12px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={handleCancelEdit}
            >
              <XIcon size={12} color="white" />
            </button>
          </div>
        ) : (
          <button
            className="edit-btn"
            style={{
              background: "#F0EFFA",
              color: "#222",
              border: "none",
              borderRadius: 8,
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => handleEditClick(field)}
          >
            Editar
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Mi perfil</h2>

      {renderField("name", "Nombre", profile.name)}
      {renderField("email", "Correo electrónico", profile.email)}
      {renderField("phone", "Teléfono", profile.phone)}
      {renderField("password", "Contraseña", "********", true)}

      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          style={{
            background: "#F0EFFA",
            color: "#222",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onClick={() => (window.location.href = "/historial")}
        >
          <HistoryIcon size={16} /> Historial de pedidos
        </button>

        <button
          style={{
            background: "#F0EFFA",
            color: "#222",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onClick={() => (window.location.href = "/histReview")}
        >
          <HistoryIcon size={16} /> Historial de reseñas
        </button>

        <button
          style={{
            background: "#eab5c5",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Desconectarse
        </button>
      </div>
    </div>
  );
};

export default Profile;
