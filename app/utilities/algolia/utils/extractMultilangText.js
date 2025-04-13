// 📁 app/utilities/algolia/utils/extractMultilangText.js
export const extractMultilangText = (fieldArray, preferredLang = 'en', locales = ['en']) => {
  if (!Array.isArray(fieldArray) || fieldArray.length === 0) return null;

  let foundLang = null;
  let foundText = null;

  for (const item of fieldArray) {
    if (item?.lang === preferredLang && item.abouttext) return item.abouttext;
  }

  for (const item of fieldArray) {
    if (item?.lang === 'en' && item.abouttext) {
      foundLang = 'en';
      foundText = item.abouttext;
      break;
    }
  }

  if (!foundText) {
    for (const lang of locales) {
      const item = fieldArray.find(f => f.lang === lang && f.abouttext);
      if (item) {
        foundLang = item.lang;
        foundText = item.abouttext;
        break;
      }
    }
  }

  if (!foundText) {
    const fallback = fieldArray.find(f => f.abouttext);
    if (fallback) {
      foundLang = fallback.lang || null;
      foundText = fallback.abouttext;
    }
  }

  if (foundText && foundLang && foundLang !== preferredLang) {
    return `[TEXT AVAILABLE ONLY IN ${foundLang.toUpperCase()}] ${foundText}`;
  }

  return foundText || null;
};