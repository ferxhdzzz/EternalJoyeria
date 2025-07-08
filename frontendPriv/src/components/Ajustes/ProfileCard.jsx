import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from 'react-router-dom';
import usePerfilAdmin from "../../hooks/Ajustes/useFetchAjustes";
import useDataAjustes from "../../hooks/Ajustes/useDataAjustes";
import Label from "./Label";
import Button from "./Button";
import "./ProfileCard.css";

const ProfileCard = () => {
  const { admin, loading, error } = usePerfilAdmin();
  const { updateAdmin, uploadImage } = useDataAjustes();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const fileInputRef = useRef(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const [editingField, setEditingField] = useState(null); // "nombre" | "correo"

  useEffect(() => {
    if (admin) {
      reset({
        nombre: admin.name || "",
        correo: admin.email || "",
      });
      setImagenPreview(admin.profilePicture || null);
    }
  }, [admin, reset]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {};
      if (editingField === "nombre") updatedData.name = data.nombre;
      if (editingField === "correo") updatedData.email = data.correo;
      await updateAdmin(updatedData);
      setEditingField(null);
    } catch (e) {
      console.error("Error al actualizar:", e);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagenPreview(previewUrl);

      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        await updateAdmin({ profilePicture: imageUrl });
      }
    }
  };

  if (loading) return <p className="cargando-texto">Cargando perfil...</p>;
  if (error) return <p className="error-texto">{error}</p>;

  return (
    <form className="profile-card" onSubmit={handleSubmit(onSubmit)}>
      {/* Imagen y botón */}  
      <div className="profile-header">
        {imagenPreview && (
          <div
            className="preview-circle"
            style={{ backgroundImage: `url(${imagenPreview})` }}
          />
        )}
        <Button text="Actualizar foto" onClick={() => fileInputRef.current?.click()} />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImagenChange}
        />
      </div>

      <div className="info-container">
        <div className="info-box">
          {/* Nombre */}
          <Label text="Nombre" />
          <div className="info-row">
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="info-input"
              disabled={editingField !== "nombre"}
            />
            {editingField === "nombre" ? (
              <Button text="Guardar" className="edit-button" />
            ) : (
              <Button text="Editar" className="edit-button" onClick={() => handleEdit("nombre")} />
            )}
          </div>
          {errors.nombre && <p className="error-texto">{errors.nombre.message}</p>}

          {/* Correo */}
          <Label text="Correo" />
          <div className="info-row">
            <input
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de correo inválido"
                }
              })}
              className="info-input"
              disabled={editingField !== "correo"}
            />
            {editingField === "correo" ? (
              <Button text="Guardar" className="edit-button" />
            ) : (
              <Button text="Editar" className="edit-button" onClick={() => handleEdit("correo")} />
            )}
          </div>
          {errors.correo && <p className="error-texto">{errors.correo.message}</p>}

          {/* Contraseña */}
          <Label text="Contraseña" />
          <div className="info-row">
            <input
              type="password"
              className="info-input"
              value="**********"
              disabled
            />
            <NavLink to="/recuperacion/">
              <Button text="¿Olvidó la contraseña?" className="edit-button" />
            </NavLink>
          </div>
        </div>

        {/* Descripción */}
        <div className="admin-box">
          <div className="info-row">
            <Label text="Acerca del administrador" />
            <p className="admin-description">
              El administrador es el usuario responsable de gestionar y supervisar el funcionamiento completo del sitio web de Eternal Joyería...
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileCard;
