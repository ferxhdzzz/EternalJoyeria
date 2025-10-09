import React from "react";
import EliminarButton from "../Boton/EliminarButton"; // Asumo la ruta
import "./ResenaRow.css";

const ResenaRow = ({
  id_customer,
  rank,
  comment,
  id_product,
  images = [],
  onClick,
}) => {
  // Obtiene el nombre del cliente de forma segura
  const nombre =
    typeof id_customer === "object" && id_customer
      ? `${id_customer?.firstName || ""} ${id_customer?.lastName || ""}`
      : String(id_customer || 'Desconocido'); // Manejo de null/undefined

  // Obtiene el nombre del producto de forma segura
  const producto =
    typeof id_product === "object" && id_product
      ? `${id_product?.name || "Producto Eliminado"}` // Usamos "Producto Eliminado" en lugar de string vacío
      : String(id_product || 'Desconocido');

  return (
    <tr className="resena-row">
      <td>{nombre}</td>
      <td>{String(rank)}</td>
      <td>{String(comment)}</td>

      {/* CELDA DE IMÁGENES: Muestra las miniaturas */}
      <td className="resena-images-cell">
        {images.length > 0 ? (
          <div className="resena-images-container">
            {images.slice(0, 3).map(
              (imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Reseña imagen ${index + 1}`}
                  className="resena-thumbnail"
                />
              )
            )}
            {images.length > 3 && (
              <span className="image-count">+{images.length - 3}</span>
            )}
          </div>
        ) : (
          <span>N/A</span>
        )}
      </td>
      {/* FIN CELDA DE IMÁGENES */}

      <td>{producto}</td>
      <td>
        <EliminarButton onClick={onClick} confirmar />
      </td>
    </tr>
  );
};

export default ResenaRow;