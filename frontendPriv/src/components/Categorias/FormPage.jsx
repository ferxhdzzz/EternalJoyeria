import React, { useState } from "react";
import UploadImage from "./UploadImage";
import InputField from "./InputField";
import TextArea from "./TextArea";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
import Swal from "sweetalert2";
import "./FormPage.css";
import "../../styles/shared/buttons.css";

const FormPage = ({ refreshCategories }) => {
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

  const validarTextoSinNumeros = (texto) => /^[A-Za-zÁÉÍÓÚñáéíóú\s]+$/.test(texto);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!imageUrl || !imageUrl.trim()) newErrors.image = "La imagen es requerida.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    Swal.fire({
      title: "Subiendo categoría...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    await saveCategorieForm({
      name: nombre.trim(),
      description: descripcion.trim(),
      image: imageUrl,
    });
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setImageUrl("");
    setErrors({});
  };

  return (
    <div className="form-wrapper">
      <form className="form-containerr" onSubmit={handleSubmit}>
        <h2 className="form-titler">Agregar categoría</h2>

        {/* “Agregar foto” usa exactamente el mismo estilo que el submit */}
        <UploadImage onUploadComplete={setImageUrl} error={errors.image} />

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

        {/* Submit con el mismo estilo y ancho que “Agregar foto” */}
        <button
          type="submit"
          className="ej-btn ej-approve ej-w-140"
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Agregar"}
        </button>
      </form>
    </div>
  );
};

export default FormPage;
