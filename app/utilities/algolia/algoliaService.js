import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.existsSync(path.resolve(__dirname, '../../../.env.local'))
  ? path.resolve(__dirname, '../../../.env.local')
  : path.resolve(__dirname, '../../../.env');

dotenv.config({ path: envFile });
console.log(`📄 Caricato env da: ${envFile}`);

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

console.log('🧪 Algolia APP ID:', ALGOLIA_APP_ID);
console.log('🧪 Algolia ADMIN KEY:', ALGOLIA_ADMIN_KEY?.slice(0, 5) + '...');

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('🚨 ALGOLIA_APP_ID e/o ALGOLIA_ADMIN_KEY mancanti.');
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
console.log('🔌 Servizio Algolia (v4) inizializzato');

const saveObject = async (indexName, record) => {
  if (!record?.objectID) {
    console.error('❌ Record non valido (manca objectID):', record);
    return;
  }

  const index = client.initIndex(indexName);
  try {
    const res = await index.saveObject(record);
    console.log(`✅ Oggetto ${record.objectID} salvato (Task ID: ${res.taskID})`);
    return res.taskID;
  } catch (err) {
    console.error(`❌ Errore salvataggio ${record.objectID}:`, err);
  }
};

const saveObjects = async (indexName, records) => {
  const validRecords = records.filter(r => r?.objectID);
  if (!validRecords.length) {
    console.warn('⚠️ Nessun record valido da inviare.');
    return;
  }

  const index = client.initIndex(indexName);
  try {
    const res = await index.saveObjects(validRecords);
    console.log(`✅ ${validRecords.length} record inviati`);
    return res;
  } catch (err) {
    console.error('❌ Errore nel salvataggio batch:', err);
    throw err;
  }
};

const deleteObject = async (indexName, objectID) => {
  if (!objectID) return;

  const index = client.initIndex(indexName);
  try {
    const res = await index.deleteObject(objectID);
    console.log(`🗑️ Oggetto ${objectID} eliminato (Task ID: ${res.taskID})`);
    return res.taskID;
  } catch (err) {
    console.error(`❌ Errore eliminazione ${objectID}:`, err);
  }
};

const deleteByFilters = async (indexName, filters) => {
  if (!filters) return;

  const index = client.initIndex(indexName);
  try {
    const res = await index.deleteBy({ filters });
    console.log(`🗑️ Oggetti con filtro "${filters}" eliminati`);
    return res;
  } catch (err) {
    console.error(`❌ Errore eliminazione per filtro "${filters}":`, err);
  }
};

const deleteObjects = async (indexName, ids) => {
  const valid = ids.filter(id => typeof id === 'string');
  if (!valid.length) return;

  const index = client.initIndex(indexName);
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
  deleteObjects,
  deleteByFilters
};
