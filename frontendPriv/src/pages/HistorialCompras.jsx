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
  const { sales, getSales, customers } = useFetchSales();
  const { deleteSale: deleteSaleOriginal } = useSaleActions(getSales);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const filteredSales = sales.filter((sale) => {
    if (!selectedCustomer) return true;
    return sale.idOrder?.idCustomer?._id === selectedCustomer;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    if (a._id < b._id) return 1;
    if (a._id > b._id) return -1;
    return 0;
  });

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
<h3>Historial de Compras</h3>
          <div className="filter-bar">
            
            <label htmlFor="customer-filter" className="filter-label">
              Filtrar por Cliente:
            </label>
            <select
              id="customer-filter"
              className="customer-select-filter"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">— Todos los Clientes —</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="sales-container">
            {sortedSales.length === 0 ? (
              <div className="no-sales-message">
                <p>No hay ventas registradas {selectedCustomer && "para este cliente"}.</p>
              </div>
            ) : (
              sortedSales.map((sale) => (
                <div key={sale._id} className="sale-card">
                  <div className="sale-header">
                    <div className="sale-customer-info">
                      <h3>
                        {sale.idOrder?.idCustomer?.firstName} {sale.idOrder?.idCustomer?.lastName}
                      </h3>
                    </div>
                    <div className={`sale-status ${sale.idOrder?.status}`}>
                      {sale.idOrder?.status}
                    </div>
                  </div>

                  <div className="sale-details">
                    <p>
                      <strong>Cliente:</strong> {sale.idOrder?.idCustomer?.firstName}{" "}
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
                      <strong>Total:</strong> ${sale.idOrder?.total?.toFixed(2)}
                    </p>
                  </div>

                  <div className="products-section">
                    <p>Productos:</p>
                    <div className="products-list">
                      {sale.idOrder?.products?.map((product, index) => (
                        <div key={index} className="product-item">
                          <p>
                            <strong>{product.productId?.name}</strong> - Cantidad: {product.quantity}  - Subtotal: ${((product.unitPriceCents / 100) || product.subtotal)?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="action-buttons">
                    <Button
                      type="button"
                      onClick={() => setEditingSaleId(sale._id)}
                      className="btn-edit"
                      disabled={loadingId === sale._id}
                    >
                      {loadingId === sale._id && editingSaleId !== sale._id
                        ? "Actualizando..."
                        : "Editar"}
                    </Button>

                  
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