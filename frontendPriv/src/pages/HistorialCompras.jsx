import React, { useState } from "react";
import Swal from "sweetalert2";
import Titulo from "../components/Componte-hook/Titulos";
import SubTitulo from "../components/Componte-hook/SubTitulo";
import Button from "../components/Componte-hook/Button";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/TopBar/TopBar";
import useFetchSales from "../hooks/HistorialVentas/useFetchSales";
import useSaleActions from "../hooks/HistorialVentas/useSaleActions";
import EditSale from "../hooks/HistorialVentas/EditSale";
import "../styles/HistorialCompras.css";

const HistorialCompras = () => {
  // Hook personalizado para obtener ventas y refrescarlas
  const { sales, getSales } = useFetchSales();
  // Hook personalizado para acciones sobre ventas, recibe función para refrescar
  const { deleteSale: deleteSaleOriginal } = useSaleActions(getSales);

  // Estado para controlar qué venta está en modo edición
  const [editingSaleId, setEditingSaleId] = useState(null);
  // Estado para controlar loading individual por venta (borrar/editar)
  const [loadingId, setLoadingId] = useState(null);

  // Función para eliminar una venta con confirmación SweetAlert
  const deleteSale = async (id) => {
    // Mostrar confirmación al usuario antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d6336c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoadingId(id); // Marcar venta en loading para deshabilitar botones

        // Mostrar loading mientras se procesa eliminación
        await Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });

        // Llamar a la función original para eliminar venta
        await deleteSaleOriginal(id);

        // Refrescar la lista de ventas luego de eliminar
        await getSales();

        Swal.close(); // Cerrar modal de loading
        // Mostrar mensaje de éxito breve
        Swal.fire({
          icon: "success",
          title: "Venta eliminada",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#d6336c",
        });
      } catch (error) {
        Swal.close();
        // Mostrar mensaje de error si falla la eliminación
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo eliminar la venta",
          confirmButtonColor: "#d6336c",
        });
      } finally {
        setLoadingId(null); // Quitar loading
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar lateral */}
      <Sidebar />
      <div className="main-content">
        {/* Barra superior */}
        <div className="topbar-wrapper">
          <Topbar />
        </div>

        {/* Contenedor principal de historial */}
        <div className="historial-compras-container">
          {/* Título y subtítulo */}
          <div className="historial-header">
            <Titulo>Historial de Compras</Titulo>
            <SubTitulo>Administra las ventas de manera efectiva</SubTitulo>
          </div>

          {/* Contenedor para las ventas */}
          <div className="sales-container">
            {/* Mostrar mensaje si no hay ventas */}
            {sales.length === 0 ? (
              <div className="no-sales-message">
                <p>No hay ventas registradas</p>
              </div>
            ) : (
              // Mapear y mostrar cada venta como tarjeta
              sales.map((sale) => (
                <div key={sale._id} className="sale-card">
                  {/* Encabezado con nombre cliente y estado venta */}
                  <div className="sale-header">
                    <div className="sale-customer-info">
                      <h3>
                        {sale.idOrder?.idCustomer?.firstName}{" "}
                        {sale.idOrder?.idCustomer?.lastName}
                      </h3>
                    </div>
                    <div className={`sale-status ${sale.idOrder?.status}`}>
                      {sale.idOrder?.status}
                    </div>
                  </div>

                  {/* Detalles principales de la venta */}
                  <div className="sale-details">
                    <p>
                      <strong>Cliente:</strong>{" "}
                      {sale.idOrder?.idCustomer?.firstName}{" "}
                      {sale.idOrder?.idCustomer?.lastName}
                    </p>
                    <p>
                      <strong>Estado:</strong> {sale.idOrder?.status}
                    </p>
                    <p>
                      <strong>Dirección:</strong> {sale.address}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {sale.idOrder?.idCustomer?.email}
                    </p>
                    <p>
                      <strong>Total:</strong> ${sale.idOrder?.total}
                    </p>
                  </div>

                  {/* Lista de productos comprados */}
                  <div className="products-section">
                    <p>Productos:</p>
                    <div className="products-list">
                      {sale.idOrder?.products?.map((product, index) => (
                        <div key={index} className="product-item">
                          <p>
                            <strong>{product.productId?.name}</strong> -
                            Cantidad: {product.quantity} - Subtotal: $
                            {product.subtotal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción para editar o eliminar */}
                  <div className="action-buttons">
                    <Button
                      type="button"
                      onClick={() => setEditingSaleId(sale._id)}
                      className="btn-edit"
                      disabled={loadingId === sale._id} // Deshabilita botón si loading
                    >
                      {loadingId === sale._id && editingSaleId !== sale._id
                        ? "Actualizando..."
                        : "Editar"}
                    </Button>
                    <Button
                      onClick={() => deleteSale(sale._id)}
                      className="btn-delete"
                      disabled={loadingId === sale._id} // Deshabilita botón si loading
                    >
                      {loadingId === sale._id ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </div>

                  {/* Mostrar componente para editar venta si corresponde */}
                  {editingSaleId === sale._id && (
                    <EditSale
                      key={sale._id}
                      saleId={sale._id}
                      onClose={() => setEditingSaleId(null)}
                      onSave={getSales} // Refrescar lista al guardar cambios
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialCompras;
