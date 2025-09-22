// frontendPriv/src/components/Categorias/EditCategoryModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
import "../../styles/Shared/buttons.css";
import "../../styles/Shared/modal.css";
import EJModal from "../Ui/EJModal.jsx";
import "./EditCategoryModal.css";

const EditCategoryModal = ({ categorie, onClose, refreshCategories }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: categorie.name,
      description: categorie.description || "",
      image: categorie.image || "",
      file: null,
    },
  });

  const { uploadImage, editCategorieById, uploading } = useDataCategorie({ reset });
  const [previewImage, setPreviewImage] = useState(categorie.image || "/karinaaaaaa.jpg");

  const watchFile = watch("file");
  const objectUrlRef = useRef(null);

  // Preview al seleccionar archivo
  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const file = watchFile[0];
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setPreviewImage(objectUrl);
    } else {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreviewImage(categorie.image || "/karinaaaaaa.jpg");
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [watchFile, categorie.image]);

  // Reset al cambiar de categoría
  useEffect(() => {
    reset({
      name: categorie.name,
      description: categorie.description || "",
      image: categorie.image || "",
      file: null,
    });
    setPreviewImage(categorie.image || "/karinaaaaaa.jpg");
  }, [categorie, reset]);

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Actualizando categoría...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let imageUrl = data.image;

    if (data.file && data.file.length > 0) {
      const uploadedUrl = await uploadImage(data.file[0]);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    await editCategorieById(categorie._id, {
      name: data.name,
      description: data.description,
      image: imageUrl,
    });

    Swal.close();
    await refreshCategories?.();
    onClose();
  };

  return (
    <EJModal
      isOpen={true}
      onClose={onClose}
      title="Editar Categoría"
      footer={
        <>
          <button type="button" className="ej-btn ej-danger ej-size-sm" onClick={onClose}>
            Cancelar
          </button>
          <button form="edit-category-form" type="submit" className="ej-btn ej-approve ej-size-sm" data-autofocus>
            {uploading ? "Subiendo..." : "Guardar"}
          </button>
        </>
      }
    >
      <form id="edit-category-form" onSubmit={handleSubmit(onSubmit)} className="edit-category-form">
        <label>Nombre </label>
        <input
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
          autoFocus
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <label>Descripción</label>
        <textarea {...register("description")} />

        <label>Imagen (subir nueva para cambiar)</label>

        {/* Input file oculto */}
        <input
          id="categoryFile"
          type="file"
          accept="image/*"
          {...register("file")}
          className="file-input-hidden"
        />

        {/* Botón igual al de "Agregar categoría" */}
        <div className="ej-upload-row">
          <label
            htmlFor="categoryFile"
            className="ej-btn ej-danger ej-file"
            style={{ pointerEvents: "auto", opacity: 1 }}
          >
            Agregar foto
          </label>
        </div>

        <div className="image-preview-box" style={{ textAlign: "center" }}>
          <p>Previsualización de la imagen:</p>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={previewImage} alt="Preview" className="preview-image" />
            {watchFile && watchFile.length > 0 && (
              <button
                type="button"
                className="ej-btn ej-danger ej-size-xs"
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  borderRadius: 999,
                  minWidth: "auto",
                  padding: "0 10px",
                }}
                onClick={() => {
                  reset((prev) => ({ ...prev, file: null }));
                  if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                  }
                  setPreviewImage(categorie.image || "/karinaaaaaa.jpg");
                  const input = document.getElementById("categoryFile");
                  if (input) input.value = "";
                }}
                title="Quitar imagen seleccionada"
                aria-label="Quitar imagen seleccionada"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </form>
    </EJModal>
  );
};

export default EditCategoryModal;
