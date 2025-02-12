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
    await loadModels(); // Ensure models are registered
    await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/avnode');

    const { default: app } = await import('./server.js');
    const PORT = app.get('port') || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Fatal error during startup:", error);
    process.exit(1); // Impedisce di avviare il server se ci sono errori critici
  }
};


startServer();
