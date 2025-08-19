// app.js
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

// Rutas
import customersRoutes from "./src/routes/customers.js";
import categoriesRouters from "./src/routes/categories.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import productsRoutes from "./src/routes/products.js";
import registerCustomersRoutes from "./src/routes/registerCustomers.js";
import reviewsRouter from "./src/routes/reviews.js";
import salesRoutes from "./src/routes/sales.js";
import ordersRoutes from "./src/routes/orders.js";
import adminRoutes from "./src/routes/Administrator.js";
import contactusRoutes from "./src/routes/contactusRoutes.js";
import wompiRoutes from "./src/routes/wompi.js"; 

import fs from "fs";
import path from "path";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";

const app = express();

// CORS para ambos puertos (5173 y 5174)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://eternal-joyeria.vercel.app/", ],
    credentials: true,
  })
);

// Swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./Docs.json"), "utf-8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Sesiones (cookies)
app.use(
  session({
    secret: "eternaljoyeria",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true solo si usas HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* ===== Rutas públicas ===== */
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/registerCustomers", registerCustomersRoutes);
app.use("/api/contactus", contactusRoutes);
app.use("/api/products", productsRoutes); // pública según la rama

/* ===== Rutas protegidas ===== */
app.use("/api/customers", validateAuthToken(["admin", "customer"]), customersRoutes);
app.use("/api/categories", validateAuthToken(["admin", "customer"]), categoriesRouters);
app.use("/api/admins", validateAuthToken(["admin"]), adminRoutes);
app.use("/api/reviews", validateAuthToken(["admin", "customer"]), reviewsRouter);
app.use("/api/sales", validateAuthToken(["admin", "customer"]), salesRoutes);
app.use("/api/orders", validateAuthToken(["admin", "customer"]), ordersRoutes);
app.use("/api/wompi", validateAuthToken(["admin", "customer"]), wompiRoutes);

export default app;
