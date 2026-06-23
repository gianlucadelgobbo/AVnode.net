import mongoose from "mongoose";
import moment from "moment";
import "moment-duration-format";

import fs from "fs";
import path from "path";
import config from "getconfig";
import { getCurrentRequest } from "./requestContext.js";

function createLocalizedMoment(locale) {
  const fn = (date) => moment(date).locale(locale);
  fn.utc = (...args) => moment.utc(...args).locale(locale);
  fn.duration = (...args) => moment.duration(...args).locale(locale);
  fn.locale = () => locale;
  return fn;
}

let connectionAttempts = 0;
const MAX_RETRIES = 5;


mongoose.plugin((schema) => {
  schema.pre(["find", "findOne"], function (next) {
    if (!this.$locals) this.$locals = {}; // ✅ Ensure `$locals` exists

    if (this.options?.req) {
      this.$locals.__ = typeof this.options.req.__ === "function" ? this.options.req.__ : (text) => text;
      this.$locals.locale = this.options.req.session?.current_lang || "en";

      this.$locals.moment = this.options.req.moment ? createLocalizedMoment(this.$locals.locale) : createLocalizedMoment(this.$locals.locale);
    } else {
      console.warn("❌ WARNING: No `req` found in query. Defaulting to 'en'.");
      this.$locals.__ = (text) => text;
      this.$locals.locale = "en";
      this.$locals.moment = createLocalizedMoment("en");
    }

    next();
  });

  schema.post("init", function (doc) {
    if (!doc.$locals) doc.$locals = {};

    var currentReq = getCurrentRequest();
    doc.$locals.locale = currentReq?.session?.current_lang || "en";
    doc.$locals.__ = (currentReq && typeof currentReq.__ === "function") ? currentReq.__.bind(currentReq) : (text) => text;
    doc.$locals.moment = createLocalizedMoment(doc.$locals.locale);

    /* console.log("⚠️ DEBUG: Post-init Hook Executed", {
      docLang: doc.$locals.locale,
    }); */
  });
});





const originalExec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function (...args) {
  if (!this.options.req) {
    var currentReq = getCurrentRequest();
    if (currentReq) {
      this.setOptions({ req: currentReq });
    }
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
