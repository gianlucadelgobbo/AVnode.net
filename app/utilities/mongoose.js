import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import config from "getconfig"; // Assumendo che esista un file config.js

let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 secondi tra i tentativi

const connectDB = async (MONGO_URI) => {
  if (connectionAttempts >= MAX_RETRIES) {
    console.error("❌ Maximum MongoDB retries reached. Exiting...");
    process.exit(1);
  }

  try {
    console.log(`🔄 Attempting to connect to MongoDB... (${connectionAttempts + 1}/${MAX_RETRIES})`);
    await mongoose.connect(MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 10000, // Timeout maggiore per evitare errori
      socketTimeoutMS: 60000, // 1 minuto per evitare timeout improvvisi
      retryWrites: true,
    });
    console.log("✅ Connected to MongoDB:", MONGO_URI);
    connectionAttempts = 0; // Reset counter on success
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    connectionAttempts++;
    setTimeout(() => connectDB(MONGO_URI), RETRY_INTERVAL);
  }
};


// 🔹 Funzione per caricare i modelli Mongoose dinamicamente
const loadModels = async () => {
  const folders = config.modelPaths || [path.join(config.appRoot, "app/models")];

  console.log(`📂 Loading models from:`, folders);

  for (const folder of folders) {
    if (!fs.existsSync(folder)) {
      console.warn(`⚠️ Models directory not found: ${folder}`);
      continue;
    }

    const files = await fs.promises.readdir(folder);
    const modelFiles = files.filter(file => file.endsWith(".js") && file !== "index.js");

    for (const file of modelFiles) {
      try {
        const { default: model } = await import(`file://${path.join(folder, file)}`);
        if (model?.modelName) {
          console.log(`✅ Model Loaded: ${model.modelName}`);
        } else {
          console.warn(`⚠️ No modelName found in ${file}`);
        }
      } catch (err) {
        console.error(`❌ Error loading model ${file}:`, err.message);
      }
    }
  }
};

// 🔹 Esportazione DEFINITIVA
export { mongoose, connectDB, loadModels };
