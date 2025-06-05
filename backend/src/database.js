// backend/src/database.js
import mongoose from "mongoose";
import { config } from "./config.js";

const URI = config.db.URI;

/**
 * connectWithRetry: Try to connect to MongoDB. If it fails, wait 5 seconds and retry.
 */
const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(URI) // No need to pass useNewUrlParser/useUnifiedTopology here
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database is connected");
});
connection.on("disconnected", () => {
  console.log("Database disconnected, retrying connection...");
  connectWithRetry();
});
connection.on("error", (err) => {
  console.error("Database error:", err);
});

export default mongoose;
