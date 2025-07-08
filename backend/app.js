// Importo todo lo de la libreria de Express
import express from "express";
import cors from "cors";
import customersRoutes from "./src/routes/customers.js";

import categoriesRouters from "./src/routes/categories.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import productsRoutes from "./src/routes/products.js";
import registerCustomersRoutes from "./src/routes/registerCustomers.js";
import reviewsRouter from "./src/routes/reviews.js";
import salesRoutes from "./src/routes/sales.js"
import ordersRoutes from "./src/routes/orders.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./src/routes/Administrator.js";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";

// Creo una constante que es igual a la libreria que importé
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//Que acepte datos en json
app.use(express.json());
//Que postman acepte guardar cookies
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
// Rutas públicas (sin autenticación)
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/registerClients", registerCustomersRoutes);

// Rutas protegidas
app.use("/api/customers", validateAuthToken(['admin', 'customer']), customersRoutes);
app.use("/api/categories", validateAuthToken(['admin', 'customer']), categoriesRouters);
app.use("/api/products", validateAuthToken(['admin', 'customer']), productsRoutes);
app.use("/api/admins", validateAuthToken(['admin']), adminRoutes);
app.use("/api/reviews", validateAuthToken(['admin', 'customer']), reviewsRouter);
app.use("/api/sales", validateAuthToken(['admin']), salesRoutes);
app.use("/api/orders", validateAuthToken(['admin', 'customer']), ordersRoutes);




// Exporto la constante para poder usar express en otros archivos
export default app;