import dotenv from "dotenv";
import fs from "fs";
// Usa `.env.local` se esiste, altrimenti `.env`
const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envFile });

// Global Config
import config from "getconfig";
import path from "path";
import { fileURLToPath } from "url";
// Fix config.appRoot in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config.appRoot = __dirname;

import { mongoose, connectDB, loadModels } from './app/utilities/mongoose.js';

const startServer = async () => {
  try {
    // 1. Load Models
    await loadModels();

    // 2. Connect to Database
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/avnode'; // Fallback URI
    const connection = await connectDB(dbUri); // Get the connection object

    // 3. Import and Start Server (after DB connection)
    const { default: app } = await import('./server.js'); // Assuming server.js exports the Express app
    const PORT = app.get('port') || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // 4. Handle Server Closing (Graceful shutdown)
    process.on('SIGINT', () => { // Handle Ctrl+C
      console.log('Shutting down server...');
      server.close(async () => { // Close the server first
        try {
          if (connection) {
            await mongoose.disconnect(); // Disconnect Mongoose
            console.log('MongoDB disconnected.');
          }
          console.log('Server closed.');
          process.exit(0); // Exit gracefully
        } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
      });
    });

  } catch (error) {
    console.error('❌ Fatal error during startup:', error);
    process.exit(1);
  }
};


startServer();
