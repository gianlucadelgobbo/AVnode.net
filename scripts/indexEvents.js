// 📁 node scripts/indexEvents.js

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from 'getconfig';
config.appRoot = path.join(__dirname, '..'); // ✅ Corretto per puntare alla root del progetto

import { mongoose, connectDB, loadModels } from '../app/utilities/mongoose.js';
import { expandEventToInstances } from '../app/utilities/algolia/extractors/extractEvent.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from '../app/utilities/algolia/constants.js';
import algoliaService from '../app/utilities/algolia/algoliaService.js';

const SEND_TO_ALGOLIA = true;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avnode';

const envFile = fs.existsSync(path.resolve(__dirname, '../.env.local'))
  ? path.resolve(__dirname, '../.env.local')
  : path.resolve(__dirname, '../.env');
  
dotenv.config({ path: envFile });

const indexEventShows = async () => {
  console.log('🚀 Inizio indicizzazione EventShow...');

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

    const EventShow = mongoose.model('EventShow');

    const events = await EventShow.find({ is_public: true })
      .populate('type', 'name slug')
      .populate('categories', 'name slug')
      .populate('users', 'stagename slug')
      .populate({ path: 'partners.users', select: 'stagename slug' })
      .populate({
        path: 'program.performance',
        select: 'title slug type users',
        populate: { path: 'users', select: 'stagename slug' }
      })
      .populate({
        path: 'program_freezed.performance',
        select: 'title slug type users',
        populate: { path: 'users', select: 'stagename slug' }
      })
      .populate('videos', 'title slug url')
      .populate('galleries', 'title slug')
      .exec();

    console.log(`📦 Trovati ${events.length} eventi pubblici.`);

    if (!events.length) return console.log('ℹ️ Nessun evento da indicizzare.');

    const allRecords = events.flatMap(event => expandEventToInstances(event, LOCALES)).filter(Boolean);
    const bigRecord = allRecords.find(r => r.objectID === '5be9a0e0f6fa498e11002357_Teatro Capranica, Montecitorio_2010-03-20T10:00:00.000Z');

    if (bigRecord) {
      const size = Buffer.byteLength(JSON.stringify(bigRecord));
      console.log(`📦 Record oversize: ${bigRecord.objectID} (${size} bytes)`);
      //console.dir(bigRecord, { depth: null, colors: true });
    }
    console.log(`🛠️  Generati ${allRecords.length} record Algolia.`);
    console.dir(allRecords[0], { depth: null, colors: true });

    if (SEND_TO_ALGOLIA) {
      console.log('🚚 Invio record a Algolia in batch da 1000...');
      for (let i = 0; i < allRecords.length; i += 1000) {
        const batch = allRecords.slice(i, i + 1000);
        const res = await algoliaService.saveObjects(ALGOLIA_INDEX_NAME, batch);
        if (res?.taskID || res?.taskIDs) {
          console.log(`✅ Batch ${i}–${i + batch.length - 1} inviato (TaskID: ${res.taskID ?? res.taskIDs.join(', ')})`);
        } else {
          console.warn(`⚠️  Batch ${i}–${i + batch.length - 1} non confermato`);
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

indexEventShows();
