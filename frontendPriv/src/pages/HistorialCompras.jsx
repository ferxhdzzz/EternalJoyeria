// src/pages/HistorialCompras.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Titulo from "../components/Componte-hook/Titulos";
import SubTitulo from "../components/Componte-hook/SubTitulo";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/TopBar/TopBar";
import EditSale from "../hooks/HistorialVentas/EditSale";
import useFetchSales from "../hooks/HistorialVentas/useFetchSales";
import useSaleActions from "../hooks/HistorialVentas/useSaleActions";
import "../Styles/HistorialCompras.css";
import "../styles/shared/buttons.css";

const HistorialCompras = () => {
  const { sales, getSales } = useFetchSales();
  const { deleteSale: deleteSaleOriginal } = useSaleActions(getSales);

  const [editingSaleId, setEditingSaleId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const deleteSale = async (id) => {
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
        setLoadingId(id);
        await Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          showConfirmButton: false,
        });

        await deleteSaleOriginal(id);
        await getSales();

        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Venta eliminada",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#d6336c",
        });
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo eliminar la venta",
          confirmButtonColor: "#d6336c",
        });
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="topbar-wrapper">
          <Topbar />
        </div>

        <div className="historial-compras-container">
          <div className="historial-header">
            <Titulo>Historial de Compras</Titulo>
            <SubTitulo>Administra las ventas de manera efectiva</SubTitulo>
          </div>

          <div className="sales-container">
            {sales.length === 0 ? (
              <div className="no-sales-message">
                <p>No hay ventas registradas</p>
              </div>
            ) : (
              sales.map((sale) => (
                <div key={sale._id} className="sale-card">
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
                      <strong>Email:</strong> {sale.idOrder?.idCustomer?.email}
                    </p>
                    <p>
                      <strong>Total:</strong> ${sale.idOrder?.total}
                    </p>
                  </div>

                  <div className="products-section">
                    <p>Productos:</p>
                    <div className="products-list">
                      {sale.idOrder?.products?.map((product, index) => (
                        <div key={index} className="product-item">
                          <p>
                            <strong>{product.productId?.name}</strong> - Cantidad:{" "}
                            {product.quantity} - Subtotal: ${product.subtotal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                  <div className="action-buttons">
                    <div className="ej-btn-set">
                      <button
                        type="button"
                        className="ej-btn ej-approve ej-size-sm"
                        onClick={() => setEditingSaleId(sale._id)}
                        disabled={loadingId === sale._id}
                      >
                        {loadingId === sale._id && editingSaleId !== sale._id
                          ? "Actualizando..."
                          : "Editar"}
                      </button>

                      <button
                        type="button"
                        className="ej-btn ej-danger ej-size-sm"
                        onClick={() => deleteSale(sale._id)}
                        disabled={loadingId === sale._id}
                      >
                        {loadingId === sale._id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>

                  {editingSaleId === sale._id && (
                    <EditSale
                      key={sale._id}
                      saleId={sale._id}
                      onClose={() => setEditingSaleId(null)}
                      onSave={getSales}
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
