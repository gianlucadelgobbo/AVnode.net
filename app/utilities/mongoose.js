import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import config from "getconfig"; // Assumendo che esista un file config.js
import moment from "moment";

let connectionAttempts = 0;
const MAX_RETRIES = 5;


mongoose.plugin((schema) => {
  schema.pre(["find", "findOne"], function (next) {
    if (!this.$locals) this.$locals = {}; // ✅ Ensure `$locals` exists

    if (this.options?.req) {
      this.$locals.__ = typeof this.options.req.__ === "function" ? this.options.req.__ : (text) => text;
      this.$locals.locale = this.options.req.session?.current_lang || "en";
      this.$locals.isApi = this.options.req.isApi ?? false; // ✅ Store API flag
      this.$locals.moment = (date) => moment(date).locale(this.$locals.locale);
    } else {
      this.$locals.__ = (text) => text; // Fallback
      this.$locals.locale = "en"; // Default
      this.$locals.isApi = false;
      this.$locals.moment = (date) => moment(date).locale("en");
    }

    next();
  });

  // ✅ Ensure `isApi`, translations, and moment are available in Mongoose documents
  schema.post("init", function (doc) {
    if (!doc.$locals) {
      doc.$locals = {};
    }
    doc.$locals.__ = doc.$locals.__ || (text) => text;
    doc.$locals.locale = global.currentRequest?.session?.current_lang || "en";
    doc.$locals.isApi = global.currentRequest?.isApi ?? false; // ✅ Attach API flag
    doc.$locals.moment = (date) => moment(date).locale(doc.$locals.locale);
  });
});




const originalExec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function (...args) {
  if (!this.options.req && global.currentRequest) {
    /* console.log("⚠️ DEBUG: Attaching `req.session.current_lang` to query", {
      globalReqExists: !!global.currentRequest,
      globalLang: global.currentRequest?.session?.current_lang || "⚠️ MISSING",
    }); */

    this.setOptions({ req: global.currentRequest });
  }

  try {
    const result = await originalExec.apply(this, args);
    /* console.log("✅ DEBUG: Query Executed, Checking $locals", {
      queryLang: this.options.req?.session?.current_lang || "⚠️ MISSING",
    }); */

    return result;
  } catch (error) {
    //console.error("❌ Mongoose Query Execution Error:", error);
    throw error;
  }
};

const connectDB = async (MONGO_URI) => {
  if (connectionAttempts >= MAX_RETRIES) {
    console.error("❌ Maximum MongoDB retries reached. Exiting...");
    process.exit(1);
  }

  try {
    console.log(`🔄 Attempting to connect to MongoDB... (${connectionAttempts + 1}/${MAX_RETRIES})`);
    await mongoose.connect(MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production", // Disabilitato in produzione
      serverSelectionTimeoutMS: 5000, // Timeout per selezione server
      socketTimeoutMS: 45000, // Timeout per connessioni inattive
      retryWrites: true, // Riprova scritture fallite
    });
    console.log("✅ Connected to MongoDB:", MONGO_URI);
    connectionAttempts = 0; // Reset counter on success
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    connectionAttempts++;
    setTimeout(() => connectDB(MONGO_URI), 5000);
  }
};


// 🔹 Funzione per caricare i modelli Mongoose dinamicamente
const loadModels = async () => {
  const folders = config.modelPaths || [path.join(config.appRoot, "app/models")];

  //console.log(`📂 Loading models from:`, folders);

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
        /* if (model?.modelName) {
          console.log(`✅ Model Loaded: ${model.modelName}`);
        } else {
          console.warn(`⚠️ No modelName found in ${file}`);
        } */
      } catch (err) {
        console.error(`❌ Error loading model ${file}:`, err.message);
      }
    }
  }
};
// 🔹 Esportazione DEFINITIVA
export { mongoose, connectDB, loadModels };
