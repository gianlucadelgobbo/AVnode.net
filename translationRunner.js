const path = require("path");
const manageTranslations = require("react-intl-translations-manager").default;

manageTranslations({
    messagesDirectory: path.join(__dirname, "app/redux/i18n/messages"),
    translationsDirectory: path.join(__dirname, "app/redux//i18n/locales/"),
    languages: ["en", "fr", "es"]
});