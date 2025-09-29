import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import usePerfilAdmin from "../../hooks/Ajustes/useFetchAjustes"; 
import useDataAjustes from "../../hooks/Ajustes/useDataAjustes"; 
import Label from "./Label"; 
import Button from "./Button";
import "./ProfileCard.css";

const CONFIRM_TYPE = {
    SAVE_DATA: "SAVE_DATA",
    SAVE_IMAGE: "SAVE_IMAGE",
};

const ProfileCard = () => {
    const { admin, loading, error } = usePerfilAdmin();
    const { updateAdmin, uploadImage } = useDataAjustes();
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();

    const [imagenPreview, setImagenPreview] = useState(null);
    const [editingField, setEditingField] = useState(null); // "nombre" | "correo" | "foto"
    const [nuevaFoto, setNuevaFoto] = useState(null);

    const [confirmState, setConfirmState] = useState({
        isVisible: false,
        title: "",
        text: "",
        type: null,
        payload: null,
    });

    useEffect(() => {
        if (admin) {
            reset({
                nombre: admin.name || "",
                correo: admin.email || "",
            });
            setImagenPreview(admin.profilePicture || null);
        }
    }, [admin, reset]);

    const handleEdit = (field) => {
        setEditingField(field);
    };

    const showCustomConfirm = ({ title, text, type, payload }) => {
        setConfirmState({ isVisible: true, title, text, type, payload });
    };

    const onSubmit = (data) => {
        const updatedData = {
            name: data.nombre,
            email: data.correo,
        };
        showCustomConfirm({
            title: "¿Guardar cambios?",
            text: "Se actualizará tu nombre y/o correo electrónico.",
            type: CONFIRM_TYPE.SAVE_DATA,
            payload: updatedData,
        });
    };

    const handleImageSubmit = () => {
        if (!nuevaFoto) {
            alert("Selecciona una imagen primero.");
            return;
        }
        showCustomConfirm({
            title: "¿Guardar nueva foto?",
            text: "Se subirá la nueva imagen y se actualizará tu perfil.",
            type: CONFIRM_TYPE.SAVE_IMAGE,
        });
    };

    const executeAction = async (confirmed) => {
        const { type, payload } = confirmState;
        setConfirmState({ isVisible: false, title: "", text: "", type: null, payload: null });
        if (!confirmed) return;

        try {
            if (type === CONFIRM_TYPE.SAVE_DATA) {
                const updatedAdmin = await updateAdmin(payload);
                if (updatedAdmin) {
                    alert("Éxito: Tu perfil ha sido actualizado");
                    setEditingField(null);
                }
            } else if (type === CONFIRM_TYPE.SAVE_IMAGE) {
                const imageUrl = await uploadImage(nuevaFoto);
                if (imageUrl) {
                    const valores = getValues();
                    const updatedAdmin = await updateAdmin({
                        name: valores.nombre,
                        email: valores.correo,
                        profilePicture: imageUrl,
                    });
                    if (updatedAdmin) {
                        alert("Éxito: Foto actualizada");
                        setEditingField(null);
                        setNuevaFoto(null);
                        setImagenPreview(imageUrl);
                    }
                } else {
                    alert("Error: No se pudo actualizar la foto.");
                }
            }
        } catch (e) {
            console.error("Error al ejecutar acción:", e);
            alert("Error: Ocurrió un error al procesar la solicitud.");
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
                                disabled
                            />
                            <Button text="Editar" onClick={() => handleEdit("nombre")} />
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
                                disabled
                            />
                            <Button text="Editar" onClick={() => handleEdit("correo")} />
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
                                    <Button text="Guardar" type="submit" />
                                    <Button text="Cancelar" className="cc" onClick={() => setEditingField(null)} />
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
                            <div className="button-group">
                                <Button text="Guardar" onClick={handleImageSubmit} />
                                <Button text="Cancelar" className="cc" onClick={() => { setEditingField(null); setNuevaFoto(null); }} />
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Modal confirmación */}
            {confirmState.isVisible && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3>{confirmState.title}</h3>
                        <p>{confirmState.text}</p>
                        <div className="button-group">
                            <Button text="Sí, guardar" onClick={() => executeAction(true)} />
                            <Button text="Cancelar" className="cc" onClick={() => executeAction(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileCard;
