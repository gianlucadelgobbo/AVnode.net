// algoliaService.js

import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
import fs from 'fs';

const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envFile });

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('🚨 ALGOLIA_APP_ID e/o ALGOLIA_ADMIN_KEY mancanti.');
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

console.log(`🔌 Servizio Algolia (v4) inizializzato`);

const saveObject = async (record) => {
  if (!record?.objectID) {
    console.error('❌ Record non valido (manca objectID):', record);
    return;
  }

  try {
    const res = await index.saveObject(record);
    console.log(`✅ Oggetto ${record.objectID} salvato (Task ID: ${res.taskID})`);
    return res.taskID;
  } catch (err) {
    console.error(`❌ Errore salvataggio ${record.objectID}:`, err);
  }
};

const saveObjects = async (ALGOLIA_INDEX_NAME, records) => {
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  const validRecords = records.filter(r => r?.objectID);
  if (!validRecords.length) {
    console.warn('⚠️ Nessun record valido da inviare.');
    return;
  }

  try {
    const res = await index.saveObjects(validRecords);
    console.log(`✅ ${validRecords.length} record inviati`);
    console.log('🧪 Response da Algolia:', res);
    return res;
  } catch (err) {
    console.error('❌ Errore nel salvataggio batch:', err);
  }
};

const deleteObject = async (objectID) => {
  if (!objectID) return;

  try {
    const res = await index.deleteObject(objectID);
    console.log(`🗑️ Oggetto ${objectID} eliminato (Task ID: ${res.taskID})`);
    return res.taskID;
  } catch (err) {
    console.error(`❌ Errore eliminazione ${objectID}:`, err);
  }
};

const deleteObjects = async (ids) => {
  const valid = ids.filter(id => typeof id === 'string');
  if (!valid.length) return;

  try {
    const res = await index.deleteObjects(valid);
    console.log(`🗑️ ${valid.length} oggetti eliminati (Task ID: ${res.taskID})`);
    return res.taskID;
  } catch (err) {
    console.error('❌ Errore eliminazione batch:', err);
  }
};

export default {
  saveObject,
  saveObjects,
  deleteObject,
  deleteObjects
};
