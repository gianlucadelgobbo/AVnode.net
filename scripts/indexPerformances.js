// 📁 node scripts/indexPerformances.js

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from 'getconfig';
config.appRoot = path.join(__dirname, '..'); // ✅ Corretto per puntare alla root del progetto

import { mongoose, connectDB, loadModels } from '../app/utilities/mongoose.js';
import { expandPerformanceToRecord } from '../app/utilities/algolia/extractors/extractPerformance.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from '../app/utilities/algolia/constants.js';
import algoliaService from '../app/utilities/algolia/algoliaService.js';

const SEND_TO_ALGOLIA = true;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avnode';

const envFile = fs.existsSync(path.resolve(__dirname, '../.env.local')) ? '../.env.local' : '../.env';
dotenv.config({ path: envFile });

const indexPerformances = async () => {
  console.log('🚀 Inizio indicizzazione Performance...');

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

    const Performance = mongoose.model('Performance');

    //const performances = await Performance.find({ is_public: true, bookings: {$exists: true, $not: {$size: 0}} , galleries: {$exists: true, $not: {$size: 0}} , videos: {$exists: true, $not: {$size: 0}} })
    const performances = await Performance.find({ is_public: true })
      .populate('type', 'name slug')
      .populate('categories', 'name slug')
      .populate('users', 'stagename slug')
      .populate('videos', 'title slug url')
      .populate('galleries', 'title slug')
      .populate({
        path: 'bookings.event',
        select: 'title slug'
      })
      .exec();

    console.log(`📦 Trovate ${performances.length} performance pubbliche.`);

    if (!performances.length) return console.log('ℹ️ Nessuna performance da indicizzare.');

    const allRecords = performances.map(perf => expandPerformanceToRecord(perf, LOCALES)).filter(Boolean);
    console.log(`🛠️  Generati ${allRecords.length} record Algolia.`);
    console.dir(allRecords[0], { depth: null, colors: true });

    if (SEND_TO_ALGOLIA) {
      console.log('🧹 Pulizia record "performance" esistenti (rimuove orfani prima del reindex)...');
      await algoliaService.deleteByFilters(ALGOLIA_INDEX_NAME, 'type:performance');

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

indexPerformances();
