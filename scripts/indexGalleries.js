// 📁 node scripts/indexGalleries.js

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import config from 'getconfig';
import { mongoose, connectDB, loadModels } from '../app/utilities/mongoose.js';
import { expandGalleryToRecord } from '../app/utilities/algolia/extractors/extractGallery.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from '../app/utilities/algolia/constants.js';
import algoliaService from '../app/utilities/algolia/algoliaService.js';

const SEND_TO_ALGOLIA = true;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avnode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config.appRoot = path.resolve(__dirname, '..');

const envFile = fs.existsSync(path.resolve(config.appRoot, '.env.local'))
  ? path.resolve(config.appRoot, '.env.local')
  : path.resolve(config.appRoot, '.env');

dotenv.config({ path: envFile });

const indexGalleries = async () => {
  console.log('🚀 Inizio indicizzazione Gallery...');

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI non definito.');
    return;
  }

  let connection;
  try {
    await loadModels();
    console.log('✅ Modelli caricati');

    connection = await connectDB(MONGODB_URI);
    console.log('✅ Connesso a MongoDB');

    const Gallery = mongoose.model('Gallery');

    const galleries = await Gallery.find({ is_public: true })
      .populate('users', 'stagename slug')
      .populate('performances', 'title slug')
      .populate('events', 'title slug')
      .exec();

    console.log(`📦 Trovate ${galleries.length} gallerie pubbliche.`);

    if (!galleries.length) return console.log('ℹ️ Nessuna gallery da indicizzare.');

    const allRecords = galleries
      .map(gallery => expandGalleryToRecord(gallery, LOCALES))
      .filter(Boolean);

    console.log(`🛠️  Generati ${allRecords.length} record Algolia.`);
    console.dir(allRecords[0], { depth: null, colors: true });

    if (SEND_TO_ALGOLIA) {
      console.log('🧹 Pulizia record "gallery" esistenti (rimuove orfani prima del reindex)...');
      await algoliaService.deleteByFilters(ALGOLIA_INDEX_NAME, 'type:gallery');

      console.log('🚚 Invio record a Algolia in batch da 1000...');
      for (let i = 0; i < allRecords.length; i += 1000) {
        const batch = allRecords.slice(i, i + 1000);
        try {
          const res = await algoliaService.saveObjects(ALGOLIA_INDEX_NAME, batch);
          if (res?.taskID || res?.taskIDs) {
            console.log(`✅ Batch ${i}–${i + batch.length - 1} inviato (TaskID: ${res.taskID ?? res.taskIDs.join(', ')})`);
          } else {
            console.warn(`⚠️  Batch ${i}–${i + batch.length - 1} non confermato`);
          }
        } catch (batchErr) {
          console.error(`❌ Batch ${i}–${i + batch.length - 1} fallito, continuo con i successivi:`, batchErr.message);
        }
      }
    } else {
      console.log('🧪 Modalità test attiva — record NON inviati ad Algolia.');
    }
  } catch (err) {
    console.error('❌ Errore durante indicizzazione:', err);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('🔌 Disconnesso da MongoDB.');
    }
    console.log('🏁 Indicizzazione completata.');
  }
};

indexGalleries();