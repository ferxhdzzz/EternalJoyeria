// src/components/Categorias/UploadImage.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./UploadImage.css";
import "../../styles/shared/buttons.css";

const UploadImage = ({ onUploadComplete, error }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Formato no válido. Usa JPG, PNG o WEBP.");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "upload_preset_eternaljoyeria");

      const res = await fetch("https://api.cloudinary.com/v1_1/dosy4rouu/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Error al subir imagen");
      const data = await res.json();
      onUploadComplete?.(data.secure_url);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="image-preview">
        {preview ? (
          <img src={preview} alt="Preview" className="preview-img" />
        ) : (
          <p className="placeholder-text">No se ha seleccionado imagen</p>
        )}
      </div>

      {/* input oculto + label con estilo DANGER (rosa pálido) */}
      <input
        type="file"
        id="categoryImage"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input-hidden"
      />
      <label
        htmlFor="categoryImage"
        className="ej-btn ej-danger "
        style={{ pointerEvents: uploading ? "none" : "auto", opacity: uploading ? 0.7 : 1 }}
      >
        {uploading ? "Subiendo..." : "Agregar foto"}
      </label>

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default UploadImage;
