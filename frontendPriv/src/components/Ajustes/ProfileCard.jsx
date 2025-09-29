import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
// Asumo que usePerfilAdmin ahora exporta 'refetchAdmin'
import usePerfilAdmin from "../../hooks/Ajustes/useFetchAjustes"; 
import useDataAjustes from "../../hooks/Ajustes/useDataAjustes"; 
import Label from "./Label"; 
import Button from "./Button";
import "./ProfileCard.css";

const ProfileCard = () => {
  // 1. Extraemos 'refetchAdmin' del hook (AHORA ESTÁ DISPONIBLE EN usePerfilAdmin.js)
  const { admin, loading, error, refetchAdmin } = usePerfilAdmin();
  const { updateAdmin, uploadImage } = useDataAjustes();
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();

  const [imagenPreview, setImagenPreview] = useState(null);
  const [editingField, setEditingField] = useState(null); // "nombre" | "correo" | "foto"
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    // 2. Este useEffect se dispara cuando 'admin' cambia (al cargar o después de un refetch)
    if (admin) {
      reset({
        nombre: admin.name || "",
        correo: admin.email || "",
      });
      setImagenPreview(admin.profilePicture || null);
    }
  }, [admin, reset]); // Dependencia clave: 'admin'

  const handleEdit = (field) => setEditingField(field);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        name: data.nombre,
        email: data.correo,
      };
      const updatedAdmin = await updateAdmin(updatedData);
      if (updatedAdmin) {
        // 3. ¡Recargar los datos después de la actualización de nombre/correo para actualizar la UI!
        refetchAdmin();
        setEditingField(null);
      }
    } catch (e) {
      console.error("Error al actualizar:", e);
    }
  };

  const handleImageSubmit = async () => {
    if (!nuevaFoto) return;
    try {
      const imageUrl = await uploadImage(nuevaFoto);
      if (imageUrl) {
        const valores = getValues();
        // Usamos updateAdmin enviando la URL de Cloudinary para que el backend la procese.
        const updatedAdmin = await updateAdmin({
          name: valores.nombre,
          email: valores.correo,
          profilePicture: imageUrl,
        });
        if (updatedAdmin) {
          // 4. Recargar los datos también al actualizar la foto
          refetchAdmin(); 
          setEditingField(null);
          setNuevaFoto(null);
          setImagenPreview(imageUrl);
        }
      }
    } catch (e) {
      console.error("Error al subir foto:", e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaFoto(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <p className="cargando-texto">Cargando perfil...</p>;
  if (error) return <p className="error-texto">Error al cargar el perfil: {error}. Asegúrate de haber iniciado sesión.</p>;

  return (
    <>
      <form className="profile-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-header">
          {imagenPreview && (
            <div className="preview-circle" style={{ backgroundImage: `url(${imagenPreview})` }} />
          )}
          <Button text="Actualizar foto" onClick={() => handleEdit("foto")} />
        </div>

        <div className="info-container">
          <div className="info-box">
            <Label text="Nombre" />
            <div className="info-row">
              <input
                {...register("nombre", { required: "El nombre es obligatorio" })}
                className="info-input"
                disabled={editingField !== "nombre"} // Habilita solo si se está editando
              />
              <Button 
                text={editingField === "nombre" ? "Guardar" : "Editar"} 
                onClick={() => editingField !== "nombre" ? handleEdit("nombre") : handleSubmit(onSubmit)()} 
                type={editingField === "nombre" ? "submit" : "button"}
              />
            </div>
            {errors.nombre && <p className="error-texto">{errors.nombre.message}</p>}

            <Label text="Correo" />
            <div className="info-row">
              <input
                {...register("correo", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de correo inválido",
                  },
                })}
                className="info-input"
                disabled={editingField !== "correo"} // Habilita solo si se está editando
              />
              <Button 
                text={editingField === "correo" ? "Guardar" : "Editar"} 
                onClick={() => editingField !== "correo" ? handleEdit("correo") : handleSubmit(onSubmit)()} 
                type={editingField === "correo" ? "submit" : "button"}
              />
            </div>
            {errors.correo && <p className="error-texto">{errors.correo.message}</p>}

            <Label text="Contraseña" />
            <div className="info-row">
              <input type="password" className="info-input" value="**********" disabled readOnly />
              <NavLink to="/recuperacion/">
                <Button text="¿Olvidó la contraseña?" />
              </NavLink>
            </div>
          </div>

          <div className="admin-box">
            <Label text="Acerca del administrador" />
            <p className="admin-description">
              El administrador es el usuario responsable de gestionar y supervisar el funcionamiento completo del 
              sitio web de Eternal Joyería. Tiene acceso exclusivo a las funciones internas de la plataforma.
            </p>
          </div>
        </div>

        {/* Modal para editar nombre/correo */}
        {editingField && editingField !== "foto" && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Editar {editingField === "nombre" ? "Nombre" : "Correo"}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register(editingField, {
                    required: `El ${editingField} es obligatorio`,
                    ...(editingField === "correo" && {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Formato de correo inválido",
                      },
                    }),
                  })}
                  className="floating-input"
                  placeholder={`Nuevo ${editingField}`}
                  autoFocus
                />
                {errors[editingField] && <p className="error-texto">{errors[editingField].message}</p>}
                <div className="button-group">
                  <Button text="Guardar" type="submit" className="purple-btn" />
                  <Button text="Cancelar" className="purple-btn" onClick={() => setEditingField(null)} />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para actualizar foto */}
        {editingField === "foto" && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Actualizar Foto</h3>
              {nuevaFoto && <img src={URL.createObjectURL(nuevaFoto)} alt="preview" className="preview-img" />}
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <br />
              <br />
              <div className="button-group">
                <Button text="Guardar" className="purple-btn" onClick={handleImageSubmit} />
                <Button text="Cancelar" className="purple-btn" onClick={() => { setEditingField(null); setNuevaFoto(null); }} />
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default ProfileCard;
