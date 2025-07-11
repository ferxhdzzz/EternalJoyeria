import React, { useState } from "react";
import Titulo from "../components/Componte-hook/Titulos";
import SubTitulo from "../components/Componte-hook/SubTitulo";
import Button from "../components/Componte-hook/Button";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/TopBar/TopBar";
import useFetchSales from "../hooks/HistorialVentas/useFetchSales";
import useSaleActions from "../hooks/HistorialVentas/useSaleActions";
import EditSale from "../hooks/HistorialVentas/EditSale";
import "../Styles/HistorialCompras.css";

const HistorialCompras = () => {
  const { sales, getSales } = useFetchSales();
  const { deleteSale } = useSaleActions(getSales);
  const [editingSaleId, setEditingSaleId] = useState(null);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
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
                      <strong>Email:</strong>{" "}
                      {sale.idOrder?.idCustomer?.email}
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
                            <strong>{product.productId?.name}</strong> -
                            Cantidad: {product.quantity} - Subtotal: $
                            {product.subtotal}
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
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => deleteSale(sale._id)}
                      className="btn-delete"
                    >
                      Eliminar
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
