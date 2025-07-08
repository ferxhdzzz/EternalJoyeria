import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import "./UploadImage.css";

const UploadImage = ({ onUploadComplete, error }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de imagen no válido. Usa JPG, PNG o WEBP.");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    // Subir imagen a Cloudinary
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload_preset_eternaljoyeria");

      const res = await fetch("https://api.cloudinary.com/v1_1/dosy4rouu/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const data = await res.json();
      onUploadComplete(data.secure_url); // se lo mandamos al form

    } catch (error) {
      toast.error("No se pudo subir la imagen");
      console.error("Error al subir imagen:", error);
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

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <button
        type="button"
        className="upload-button"
        onClick={handleCustomButtonClick}
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Subir imagen"}
      </button>

      {/* ✅ Mostrar error debajo del botón */}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default UploadImage;
