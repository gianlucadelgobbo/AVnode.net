import {locales} from "../../../../../config/default";

export const sortByLanguage = (languages) => {

    let result = [];
    locales.forEach(lang => {
        const el = languages.find(l => l.lang === lang);
        result.push(el)
    });

    return result;
};