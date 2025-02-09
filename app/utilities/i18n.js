import getconfig from 'getconfig';
import i18n from 'i18n';
import { fileURLToPath } from 'url';
import path from 'path';

// Fix `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
  locales: getconfig.locales,
  header: 'accept-language-disabled',
  defaultLocale: getconfig.defaultLocale,
  directory: path.join(__dirname, '../../locales'),
  register: global
});

export default i18n;
