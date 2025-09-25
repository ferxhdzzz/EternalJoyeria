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
import profileRoutes from "./src/routes/profile.js";
import fs from "fs";
import path from "path";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
const app = express();
// Configuración CORS para permitir conexiones desde múltiples orígenes
const allowedOrigins = [
 "http://localhost:5173",
 "http://localhost:5174",
 "http://localhost:19006", // Puerto común de Expo
 "https://eternal-joyeria.vercel.app",
 /^http:\/\/192\.168\.1\.\d{1,3}(?::\d+)?$/, // Permite cualquier puerto en la red 192.168.1.x
 /^http:\/\/192\.168\.137\.\d{1,3}(?::\d+)?$/, // Para compatibilidad con la red anterior
 /^http:\/\/10\.0\.2\.2(?::\d+)?$/, // Para emuladores de Android
 /^http:\/\/10\.0\.3\.2(?::\d+)?$/, // Para Genymotion
 /^http:\/\/localhost(?::\d+)?$/, // Cualquier puerto localhost
];
const corsOptions = {
 origin: function (origin, callback) {
   // Permitir solicitudes sin origen (como aplicaciones móviles o solicitudes de servidor)
   if (!origin) return callback(null, true);
   // Verificar si el origen está en la lista blanca
   if (
     allowedOrigins.some(allowedOrigin =>
       typeof allowedOrigin === 'string'
         ? origin === allowedOrigin
         : allowedOrigin.test(origin)
     )
   ) {
     callback(null, true);
   } else {
     console.log('Origen no permitido por CORS:', origin);
     callback(new Error('No permitido por CORS'));
   }
 },
 credentials: true,
 allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
 exposedHeaders: ['Content-Range', 'X-Content-Range'],
 preflightContinue: false,
 optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
// Manejar solicitudes OPTIONS (preflight)
app.options('*', cors(corsOptions));
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
app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewsRouter);
// pública según la rama
/* ===== Rutas protegidas ===== */
app.use("/api/customers", validateAuthToken(["admin", "customer"]), customersRoutes);
app.use("/api/categories", categoriesRouters);
app.use("/api/admins", validateAuthToken(["admin"]), adminRoutes);
//app.use("/api/reviews", validateAuthToken(["admin", "customer"]), reviewsRouter);
app.use("/api/sales", validateAuthToken(["admin", "customer"]), salesRoutes);
app.use("/api/orders", validateAuthToken(["admin", "customer"]), ordersRoutes);
app.use("/api/wompi", validateAuthToken(["admin", "customer"]), wompiRoutes);
app.use("/api/profile", validateAuthToken(["admin", "customer"]), profileRoutes);
export default app;