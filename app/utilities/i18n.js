import i18n from "i18n";
import path from "path";
import { fileURLToPath } from "url";
import config from "getconfig";

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

i18n.configure({
  locales: config.locales,
  header: "accept-language-disabled",
  defaultLocale: config.defaultLocale,
  directory: path.join(__dirname, "../../locales"), // ✅ Ensures correct path
  autoReload: true, // ✅ Automatically reloads translations
  syncFiles: true, // ✅ Keeps translation files in sync
  objectNotation: true, // ✅ Allows nested JSON keys
});

export default i18n;
