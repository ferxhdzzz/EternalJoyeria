// backend/src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Import configuration (for allowedOrigins if you want to restrict CORS)
import { config } from "./config.js";
// Import routers (we will create/update each of these files next)
import categoriesRoutes from "./routers/categories.js";
import loginRoutes from "./routers/login.js";
import logoutRoutes from "./routers/logout.js";
import registerCustomersRoutes from "./routers/registerCustomers.js";
import passwordRecoveryRoutes from "./routers/passwordRecovery.js";
//import productsRoutes from "./routers/products.js";

const app = express();

// GLOBAL MIDDLEWARE 

// Allow CORS for your front-end origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true // Permit sending of cookies
  })
);

// Parse incoming JSON payloads
app.use(express.json());

// Parse incoming cookies and attach them to req.cookies
app.use(cookieParser());

// PUBLIC ROUTES 

// User registration (no token required)
app.use("/api/registerCustomers", registerCustomersRoutes);

// User login (no token required)
app.use("/api/login", loginRoutes);

// Password recovery endpoints (no token required)
app.use("/api/passwordRecovery", passwordRecoveryRoutes);

// PROTECTED ROUTES 
// The routers themselves will apply `protect`/`authorizeAdmin` as needed.

// Logout requires a valid JWT in cookie
app.use("/api/logout", logoutRoutes);

// Category management (GET public; POST/PUT/DELETE require admin token)
app.use("/api/categories", categoriesRoutes);

// Product management (GET public; POST/PUT/DELETE require admin token)
//app.use("/api/products", productsRoutes);

// TEST / HEALTH CHECK ──────────────────────────────────────────────
app.get("/", (req, res) => {
  return res.status(200).json({ message: "API EternalJoyeria is up and running." });
});

// 404 HANDLER 
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route not found." });
});

// GLOBAL ERROR HANDLER (500) 
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error." });
});

export default app;
