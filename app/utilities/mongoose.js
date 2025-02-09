import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store loaded models
const loadModels = async () => {
  const folders = [path.join(__dirname, '../models'), path.join(__dirname, '../models/shared')];
  for (const folder of folders) {
    //console.log(`📁 Scanning folder: ${folder}`);
    const files = fs.readdirSync(folder).filter(file => file.endsWith('.js') && file !== 'index.js');
    for (const file of files) {
      try {
        //console.log(`🟡 Loading model from: ${file}`);
        const { default: model } = await import(`file://${path.join(folder, file)}`);
        if (model?.modelName) {
          //console.log(`✅ Successfully registered model: ${model.modelName}`);
        } else {
          //console.log(`⚠️ No modelName found in ${file}`);
        }
      } catch (err) {
        console.error(`❌ Error loading model ${file}:`, err.message);
      }
    }
  }
  //console.log('✅ Models successfully loaded:', Object.keys(mongoose.models));
};

const connectDB = async (MONGO_URI) => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      autoIndex: true, // Automatically build indexes
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if MongoDB is unresponsive
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("✅ Connected to MongoDB: " + MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process with failure
  }
};

export { mongoose, connectDB, loadModels };
