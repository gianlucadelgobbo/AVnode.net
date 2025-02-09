import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { mongoose, connectDB, loadModels } from './app/utilities/mongoose.js';

const startServer = async () => {
  await loadModels(); // Ensure models are registered
  //console.log('✅ Models Loaded:', Object.keys(mongoose.models));

  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dbname');

  const { default: app } = await import('./server.js');

  const PORT = app.get('port') || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
