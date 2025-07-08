import express from "express";
import cors from "cors";
import session from "express-session"; // ✅ AÑADIR
import cookieParser from "cookie-parser"; // ✅ ESTABA BIEN

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

const app = express();

// ✅ Configurar CORS para permitir cookies entre frontend y backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Configurar express-session
app.use(
  session({
    secret: "eternaljoyeria", // puedes cambiarlo por uno más seguro
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // pon true si usas HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    },
  })
);

// ✅ Rutas
app.use("/api/customers", customersRoutes);
app.use("/api/categories", categoriesRouters);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/registerClients", registerCustomersRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/reviews", reviewsRouter);
app.use("/api/sales", salesRoutes);
app.use("/api/orders", ordersRoutes);

export default app;
