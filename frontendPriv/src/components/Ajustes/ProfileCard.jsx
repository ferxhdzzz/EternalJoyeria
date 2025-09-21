import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import usePerfilAdmin from "../../hooks/Ajustes/useFetchAjustes";
import useDataAjustes from "../../hooks/Ajustes/useDataAjustes";
import Label from "./Label";
import "./ProfileCard.css";
import "../../styles/shared/buttons.css";

const ProfileCard = () => {
  const { admin, loading, error } = usePerfilAdmin();
  const { updateAdmin, uploadImage } = useDataAjustes();
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();

  const [imagenPreview, setImagenPreview] = useState(null);
  const [editingField, setEditingField] = useState(null); // "nombre" | "correo" | "foto"
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    if (admin) {
      reset({ nombre: admin.name || "", correo: admin.email || "" });
      setImagenPreview(admin.profilePicture || null);
    }
  }, [admin, reset]);

  const handleEdit = (field) => setEditingField(field);

  const onSubmit = async (data) => {
    const updatedData = { name: data.nombre, email: data.correo };
    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará tu perfil.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e91e63",
    });
    if (result.isConfirmed) {
      await updateAdmin(updatedData);
      setEditingField(null);
      Swal.fire({ title: "Actualizado", text: "Tu perfil ha sido actualizado", icon: "success", confirmButtonColor: "#e91e63" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNuevaFoto(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleImageSubmit = async () => {
    if (!nuevaFoto) {
      Swal.fire({ title: "Error", text: "Selecciona una imagen primero.", icon: "error", confirmButtonColor: "#e91e63" });
      return;
    }
    const result = await Swal.fire({
      title: "¿Guardar nueva foto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e91e63",
    });
    if (result.isConfirmed) {
      const imageUrl = await uploadImage(nuevaFoto);
      if (imageUrl) {
        const valores = getValues();
        await updateAdmin({ name: valores.nombre, email: valores.correo, profilePicture: imageUrl });
        Swal.fire({ title: "Foto actualizada", icon: "success", confirmButtonColor: "#e91e63" });
        setEditingField(null);
        setNuevaFoto(null);
        setImagenPreview(imageUrl);
      } else {
        Swal.fire({ title: "Error", text: "No se pudo actualizar la foto.", icon: "error", confirmButtonColor: "#e91e63" });
      }
    }
  };

  if (loading) return <p className="cargando-texto">Cargando perfil...</p>;
  if (error) return <p className="error-texto">{error}</p>;

  return (
    <form className="profile-card" onSubmit={handleSubmit(onSubmit)}>
      <div className="profile-header">
        {imagenPreview && <div className="preview-circle" style={{ backgroundImage: `url(${imagenPreview})` }} />}

        {/* ✅ En Ajustes: estilo “Agregar” */}
        <button type="button" className="ej-btn ej-approve ej-size-sm" onClick={() => handleEdit("foto")}>
          Actualizar foto
        </button>
      </div>

      <div className="info-container">
        <div className="info-box">
          <Label text="Nombre" />
          <div className="info-row">
            <input {...register("nombre", { required: "El nombre es obligatorio" })} className="info-input" disabled />
            {/* ✅ “Agregar” */}
            <button type="button" className="ej-btn ej-approve ej-size-xs" onClick={() => handleEdit("nombre")}>
              Editar
            </button>
          </div>

          <Label text="Correo" />
          <div className="info-row">
            <input
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato de correo inválido" }
              })}
              className="info-input"
              disabled
            />
            {/* ✅ “Agregar” */}
            <button type="button" className="ej-btn ej-approve ej-size-xs" onClick={() => handleEdit("correo")}>
              Editar
            </button>
          </div>

          <Label text="Contraseña" />
          <div className="info-row">
            <input type="password" className="info-input" value="**********" disabled readOnly />
            {/* ✅ “Agregar” */}
            <NavLink to="/recuperacion/">
              <span className="ej-btn ej-approve ej-size-xs">¿Olvidó la contraseña?</span>
            </NavLink>
          </div>
        </div>

        <div className="admin-box">
          <Label text="Acerca del administrador" />
          <p className="admin-description">
            El administrador es el usuario responsable de gestionar y supervisar el funcionamiento completo del
            sitio web de Eternal Joyería. Tiene acceso exclusivo a las funciones internas de la plataforma,
            permitiéndole agregar, editar o eliminar productos, gestionar pedidos, revisar comentarios de clientes
            y mantener actualizada la información de la tienda.
          </p>
        </div>

        <br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>

      {/* Modal editar nombre/correo */}
      {editingField && editingField !== "foto" && (
        <div className="overlay-form">
          <div className="form-content">
            <h3>Editar {editingField === "nombre" ? "Nombre" : "Correo"}</h3>
            <input
              {...register(editingField, {
                required: `El ${editingField} es obligatorio`,
                ...(editingField === "correo" && { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato de correo inválido" } }),
              })}
              className="floating-input"
              placeholder={`Nuevo ${editingField}`}
              autoFocus
            />
            {errors[editingField] && <p className="error-texto">{errors[editingField].message}</p>}

            <div className="button-group ej-btn-set">
              {/* ✅ Guardar = “Agregar” */}
              <button type="submit" className="ej-btn ej-approve ej-size-sm">Guardar</button>
              {/* ✅ Cancelar = “Danger” */}
              <button type="button" className="ej-btn ej-danger ej-size-sm" onClick={() => setEditingField(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal actualizar foto */}
      {editingField === "foto" && (
        <div className="overlay-form">
          <div className="form-content">
            <h3>Actualizar Foto</h3>

            {nuevaFoto && <img src={URL.createObjectURL(nuevaFoto)} alt="preview" className="preview-img" />}

            <input id="profileImageInput" type="file" accept="image/*" onChange={handleFileChange} className="file-input-hidden" />
            {/* ⬇️ Aquí sí: “Danger” para el label que edita/agrega la foto */}
            <label htmlFor="profileImageInput" className="ej-btn ej-danger " style={{ marginBottom: 12 }}>
              Agregar foto
            </label>

            <div className="button-group ej-btn-set">
              {/* Guardar = “Agregar” */}
              <button type="button" className="ej-btn ej-approve ej-size-sm" onClick={handleImageSubmit}>Guardar</button>
              {/* Cancelar = “Danger” */}
              <button
                type="button"
                className="ej-btn ej-danger ej-size-sm"
                onClick={() => { setEditingField(null); setNuevaFoto(null); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileCard;
