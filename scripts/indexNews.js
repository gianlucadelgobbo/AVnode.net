// 📁 node scripts/indexNews.js

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from 'getconfig';
config.appRoot = path.join(__dirname, '..');

import { mongoose, connectDB, loadModels } from '../app/utilities/mongoose.js';
import { expandNewsToRecords } from '../app/utilities/algolia/extractors/extractNews.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from '../app/utilities/algolia/constants.js';
import algoliaService from '../app/utilities/algolia/algoliaService.js';

const SEND_TO_ALGOLIA = true;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avnode';

const envFile = fs.existsSync(path.resolve(__dirname, '../.env.local'))
  ? path.resolve(__dirname, '../.env.local')
  : path.resolve(__dirname, '../.env');
  
dotenv.config({ path: envFile });

const indexNews = async () => {
  console.log('🚀 Inizio indicizzazione News...');

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

    const News = mongoose.model('News');
    const newsItems = await News.find({ is_public: true })
      .populate('categories', 'name slug')
      .populate('users', 'stagename slug')
      .exec();

    console.log(`📦 Trovate ${newsItems.length} news pubbliche.`);
    if (!newsItems.length) return console.log('ℹ️ Nessuna news da indicizzare.');

    const allRecords = newsItems.flatMap(news => expandNewsToRecords(news, LOCALES)).filter(Boolean);
    console.log(`🛠️  Generati ${allRecords.length} record Algolia.`);
    console.dir(allRecords[0], { depth: null, colors: true });

    if (SEND_TO_ALGOLIA) {
      console.log('🧹 Pulizia record "news" esistenti (rimuove orfani prima del reindex)...');
      await algoliaService.deleteByFilters(ALGOLIA_INDEX_NAME, 'type:news');

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

indexNews();
