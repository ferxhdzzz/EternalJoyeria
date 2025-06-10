// backend/src/database.js
import mongoose from "mongoose";

// 1- Configuro la URI usando la variable de entorno (con fallback local)
const URI = process.env.DB_URI || "mongodb://localhost:27017/EternalJoyeria";
mongoose.connect(URI);

// Obtengo la conexión
const connection = mongoose.connection;

// Cuando se abra correctamente
connection.once("open", () => {
  console.log("DB is connected");
});

// Si se desconecta
connection.on("disconnected", () => {
  console.log("DB is disconnected");
});

// Si ocurre un error
connection.on("error", (error) => {
  console.log("error found" + error);
});
