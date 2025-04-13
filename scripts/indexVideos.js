// 📁 node scripts/indexVideos.js

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from 'getconfig';
config.appRoot = path.resolve(__dirname, '..');

import { mongoose, connectDB, loadModels } from '../app/utilities/mongoose.js';
import { expandVideoToRecord } from '../app/utilities/algolia/extractors/extractVideo.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from '../app/utilities/algolia/constants.js';
import algoliaService from '../app/utilities/algolia/algoliaService.js';

const SEND_TO_ALGOLIA = true;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avnode';

const envFile = fs.existsSync(path.resolve(__dirname, '../.env.local'))
  ? path.resolve(__dirname, '../.env.local')
  : path.resolve(__dirname, '../.env');
dotenv.config({ path: envFile });

const indexVideos = async () => {
  console.log('🚀 Inizio indicizzazione Video...');

  let connection;
  try {
    await loadModels();
    console.log('✅ Modelli caricati');

    connection = await connectDB(MONGODB_URI);
    console.log('✅ Connesso a MongoDB');

    const Video = mongoose.model('Video');

    const videos = await Video.find({ is_public: true })
      .populate('users', 'stagename slug')
      .populate('performances', 'title')
      .populate('events', 'title')
      .populate('categories', 'name')
      .exec();

    console.log(`📦 Trovati ${videos.length} video pubblici.`);
    if (!videos.length) return console.log('ℹ️ Nessun video da indicizzare.');

    const allRecords = videos.map(video => expandVideoToRecord(video, LOCALES)).filter(Boolean);
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

indexVideos();