// backend/src/index.js

/**
 * Entry point for the Express server.
 * - Imports the main Express app (app.js)
 * - Ensures database connection is established (database.js)
 * - Starts listening on the configured port
 */

import app from "./app.js";         // Main Express configuration
import "./database.js";             // Kick off MongoDB connection (side effect only)
import { config } from "./config.js";

const port = config.server.port;

// Start the server
async function main() {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}

main();
