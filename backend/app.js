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
import salesRoutes from "./src/routes/sales.js"
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
app.use("/api/customers", customersRoutes);
app.use("/api/categories", categoriesRouters);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/registerClients", registerCustomersRoutes);
app.use ("/api/admins",adminRoutes )

=======
app.use("/api/reviews", reviewsRouter);
app.use("/api/sales", salesRoutes)
app.use("/api/orders", ordersRoutes);




// Exporto la constante para poder usar express en otros archivos
export default app;