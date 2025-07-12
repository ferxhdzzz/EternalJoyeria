import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useDataCategorie from "../../hooks/Categorias/useDataCategorias";
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

  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      // Revocar URL blob anterior si existe
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const file = watchFile[0];
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;

      setPreviewImage(objectUrl);
    } else {
      // Sin archivo nuevo: revocar blob y mostrar imagen original
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreviewImage(categorie.image || "/karinaaaaaa.jpg");
    }

    // Limpiar al desmontar componente
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [watchFile, categorie.image]);

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
    refreshCategories(); // Actualiza la lista sin recargar página
    onClose(); // Cierra el modal
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <div className="edit-modal-card">
        <h2 className="modal-title">Editar Categoría</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="edit-category-form">
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
          <input type="file" {...register("file")} accept="image/*" />

          <div className="image-preview-box">
            <p>Previsualización de la imagen:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="preview-image"
            />
          </div>

          <div className="buttons-row">
            <button type="submit" disabled={uploading} className="btn-primarycat">
              {uploading ? "Subiendo..." : "Guardar"}
            </button>
            <button type="button"  onClick={onClose} className="btn-secondarycat">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategoryModal;
