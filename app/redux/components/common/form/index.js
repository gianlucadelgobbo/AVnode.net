import { locales } from "../../../../../config/default";

export const sortByLanguage = languages => {
  let result = [];
  locales.forEach(lang => {
    const el = languages.find(l => l.lang === lang);
    result.push(el);
  });

  return result;
};

export const createMultiLanguageInitialObject = c => {
  let v = [];
  locales.forEach(l => {
    let found = v.filter(o => o.key === `${c}.${l}`).length > 0;
    if (!found) {
      v.push({
        key: `${c}.${l}`,
        value: "",
        lang: l
      });
    }
  });
  v = sortByLanguage(v);

  return v;
};

export const populateMultiLanguageObject = (
  c,
  valuesFromApi,
  joinField = "lang",
  valueField = "value",
  valueFieldFromApi = "abouttext"
) => {
  let result = createMultiLanguageInitialObject(c);

  if (Array.isArray(valuesFromApi)) {
    valuesFromApi.forEach(l => {
      if (l[joinField]) {
        let found = result.find(o => o[joinField] === l[joinField]);
        if (found) {
          found[valueField] = l[valueFieldFromApi];
        }
      }
    });
  }

  return result;
};

export const checkIfError = result => {
  const keys = Object.keys(result);
  if (!!keys.length) {
    throw result;
  } else {
    return true;
  }
};
