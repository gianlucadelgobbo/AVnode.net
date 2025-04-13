// 📁 app/utilities/algolia/pushToAlgolia.js

import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME } from './constants.js';

/**
 * Salva uno o più record su Algolia
 * @param {object|object[]} records - Uno o più record Algolia
 * @returns {Promise<object>} - Risposta da Algolia
 */
export const pushToAlgolia = async (records) => {
  const data = Array.isArray(records) ? records : [records];
  if (!data.length) return;
  return algoliaService.saveObjects(ALGOLIA_INDEX_NAME, data);
};
