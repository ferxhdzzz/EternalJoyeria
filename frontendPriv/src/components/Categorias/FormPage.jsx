import React, { useState } from "react";
import UploadImage from "./UploadImage.jsx"; 
import InputField from "./InputField";
import TextArea from "./TextArea";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
import Swal from "sweetalert2";
import "./FormPage.css";
import "../../styles/shared/buttons.css";
import "../../styles/shared/card.css";

const FormPage = ({ refreshCategories }) => {
  // Paso actual
  const [step, setStep] = useState(1);

  // Estado del formulario (misma lógica de antes)
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  const { saveCategorieForm, uploading } = useDataCategorie({
    reset: () => resetForm(),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "¡Categoría agregada!",
        text: "La categoría fue guardada correctamente.",
        confirmButtonColor: "#ff66b2",
      });
      refreshCategories && refreshCategories();
    },
  });

  // === Validaciones originales ===
  const validarTextoSinNumeros = (texto) => /^[A-Za-zÁÉÍÓÚñáéíóú\s]+$/.test(texto);

  const validarPaso1 = () => {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido.";
    else if (!validarTextoSinNumeros(nombre))
      newErrors.nombre = "El nombre no debe contener números.";
    else if (nombre.trim().length < 5)
      newErrors.nombre = "El nombre debe tener al menos 5 caracteres.";

    if (!descripcion.trim()) newErrors.descripcion = "La descripción es requerida.";
    else if (!validarTextoSinNumeros(descripcion))
      newErrors.descripcion = "La descripción no debe contener números.";
    else if (descripcion.trim().length < 3)
      newErrors.descripcion = "La descripción debe tener al menos 3 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validarPaso2 = () => {
    const newErrors = {};
    if (!imageUrl || !imageUrl.trim()) newErrors.image = "La imagen es requerida.";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // === Navegación de pasos ===
  const goNext = () => {
    if (step === 1 && validarPaso1()) setStep(2);
  };
  const goBack = () => setStep(1);

  // === Submit (misma funcionalidad original) ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok1 = validarPaso1();
    const ok2 = validarPaso2();
    if (!ok1 || !ok2) {
      setStep(!ok1 ? 1 : 2);
      return;
    }

    Swal.fire({
      title: "Subiendo categoría...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    await saveCategorieForm({
      name: nombre.trim(),
      description: descripcion.trim(),
      image: imageUrl, // 👈 igual que antes: se envía URL
    });
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setImageUrl("");
    setErrors({});
    setStep(1);
  };

  return (
    <div className="ej-card" style={{ marginBottom: "1.5rem" }}>
      <form className="category-form-card" onSubmit={handleSubmit}>
        <h2 className="form-titler">Agregar categoría</h2>

        {/* PASO 1: Nombre + Descripción */}
        {step === 1 && (
          <div className="grid-step">
            <InputField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errors.nombre}
            />

            <TextArea
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              error={errors.descripcion}
            />

            <div className="step-actions">
              <button type="button" className="ej-btn ej-approve" onClick={goNext}>
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: Agregar foto (UploadImage original) */}
        {step === 2 && (
          <div className="grid-step">
            {/* Usa tu componente original; onUploadComplete entrega la URL */}
            <UploadImage onUploadComplete={setImageUrl} error={errors.image} />

            <div className="step-actions">
              {/* Atrás con estilo pastel similar a tus botones */}
              <button type="button" className="ej-btn ej-danger ej-w-140" onClick={goBack}>
                Atrás
              </button>

              <button type="submit" className="ej-btn ej-approve ej-w-140" disabled={uploading}>
                {uploading ? "Subiendo..." : "Agregar"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormPage;
