import React from "react";
import EliminarButton from "../Boton/EliminarButton";
import "./ResenaRow.css";

const ResenaRow = ({
  id_customer,
  rank,
  comment,
  id_product,
  images = [],
  onClick,
}) => {
  const nombre =
    typeof id_customer === "object"
      ? `${id_customer?.firstName || ""} ${id_customer?.lastName || ""}`
      : String(id_customer);

  const compra =
    typeof id_product === "object"
      ? `${id_product?.name || ""}`
      : String(id_product);

  return (
    <tr className="resena-row">
      <td>{nombre}</td>
      <td>{String(rank)}</td>
      <td>{String(comment)}</td>

      {/* CELDA DE IMÁGENES */}
      <td className="resena-images-cell">
        {images.length > 0 ? (
          <div className="resena-images-container">
            {images.slice(0, 3).map(
              (
                imgUrl,
                index // Muestra solo las primeras 3
              ) => (
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

      <td>{compra}</td>
      <td>
        <EliminarButton onClick={onClick} confirmar />
      </td>
    </tr>
  );
};

export default ResenaRow;
