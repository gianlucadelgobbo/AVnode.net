// scripts/algoliaInitialIndex.js

import fs from 'fs';
import dotenv from 'dotenv';

const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envFile });

// Global Config
import config from "getconfig";
import path from "path";
import { fileURLToPath } from "url";
// Fix config.appRoot in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config.appRoot = __dirname;

import { mongoose, connectDB, loadModels } from './app/utilities/mongoose.js';
import algoliaService from './algolia/algoliaService.js';

// Potrebbe essere necessario importare altri modelli se devi popolare campi specifici
// import UserShow from '../models/UserShow.js';
// import Category from '../models/Category.js'; // Assumi esista un modello Category
// import Performance from '../models/Performance.js'; // E Performance

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Estrae testo da campi multilingua (abouts, subtitles).
 * Preferisce la lingua specificata (es. 'it'), fallback su 'en', poi sul primo disponibile.
 * @param {Array<object>} fieldArray - L'array di oggetti (es. abouts).
 * @param {string} preferredLang - La lingua preferita (es. 'it').
 * @returns {string|null} - Il testo trovato o null.
 */
const extractMultilangText = (fieldArray, preferredLang = 'en') => {
    if (!Array.isArray(fieldArray) || fieldArray.length === 0) {
        return null;
    }
    let text = null;
    let fallbackEn = null;
    let fallbackFirst = fieldArray[0]?.abouttext || null; // Usa optional chaining

    for (const item of fieldArray) {
        if (item && item.lang === preferredLang && item.abouttext) {
            text = item.abouttext;
            break; // Trovato il preferito
        }
        if (item && item.lang === 'en' && item.abouttext) {
            fallbackEn = item.abouttext; // Salva fallback 'en'
        }
    }

    return text ?? fallbackEn ?? fallbackFirst; // Ritorna nell'ordine di preferenza
};

/**
 * Trasforma un documento Mongoose EventShow in un record Algolia.
 * @param {mongoose.Document} eventShowDoc - Il documento Mongoose.
 * @returns {object|null} - L'oggetto record per Algolia o null se invalido.
 */
const transformEventShowToAlgoliaRecord = (eventShowDoc) => {
    if (!eventShowDoc || !eventShowDoc._id) {
        return null;
    }

    // Usa .toObject() per lavorare con un oggetto JS semplice e includere i virtuals
    const event = eventShowDoc.toObject({ virtuals: true, getters: true });

    // Array per raccogliere dati utili per faceting/filtering
    const categories_data = [];
    const types_data = [];
    const user_data = [];
    const venue_data = { names: [], localities: [], countries: [], geolocs: [] };
    const schedule_timestamps = { start: [], end: [] };

    // Popola categorie (assumendo che 'categories' sia popolato o sia un array di oggetti)
    if (event.categories && Array.isArray(event.categories)) {
        event.categories.forEach(cat => {
            if (cat && cat.name) categories_data.push(cat.name); // O cat.slug se preferisci
        });
    }
     // Popola tipo (assumendo che 'type' sia popolato o sia un oggetto)
    if (event.type && event.type.name) {
        types_data.push(event.type.name); // O event.type.slug
    }

    // Popola utenti (assumendo che 'users' sia popolato)
    if (event.users && Array.isArray(event.users)) {
        event.users.forEach(user => {
            if (user && user.stagename) user_data.push(user.stagename); // O user.slug
        });
    }

    // Processa schedule
    if (event.schedule && Array.isArray(event.schedule)) {
        event.schedule.forEach(sch => {
            if (sch.starttime) {
                // Converti in timestamp UNIX (secondi)
                schedule_timestamps.start.push(Math.floor(new Date(sch.starttime).getTime() / 1000));
            }
            if (sch.endtime) {
                schedule_timestamps.end.push(Math.floor(new Date(sch.endtime).getTime() / 1000));
            }
            if (sch.venue) {
                if (sch.venue.name && !venue_data.names.includes(sch.venue.name)) {
                    venue_data.names.push(sch.venue.name);
                }
                if (sch.venue.location) {
                    if (sch.venue.location.locality && !venue_data.localities.includes(sch.venue.location.locality)) {
                        venue_data.localities.push(sch.venue.location.locality);
                    }
                    if (sch.venue.location.country && !venue_data.countries.includes(sch.venue.location.country)) {
                        venue_data.countries.push(sch.venue.location.country);
                    }
                    // Estrai geo-localizzazione
                    if (sch.venue.location.geometry && typeof sch.venue.location.geometry.lat === 'number' && typeof sch.venue.location.geometry.lng === 'number') {
                        venue_data.geolocs.push({
                            lat: sch.venue.location.geometry.lat,
                            lng: sch.venue.location.geometry.lng
                        });
                    }
                }
            }
        });
    }
    // Filtra duplicati da geolocs (se necessario, anche se raro)
    const uniqueGeolocs = Array.from(new Set(venue_data.geolocs.map(JSON.stringify)), JSON.parse);


    const record = {
        objectID: event._id.toString(),
        type: 'event', // Identificatore del tipo di record
        title: event.title,
        slug: event.slug,
        about: event.aboutFull, // Estrai testo multilingua
        subtitle: extractMultilangText(event.subtitles, 'it'),
        is_public: event.is_public,
        createdAt_timestamp: event.createdAt ? Math.floor(new Date(event.createdAt).getTime() / 1000) : null,
        updatedAt_timestamp: event.updatedAt ? Math.floor(new Date(event.updatedAt).getTime() / 1000) : null,

        // Campi per Faceting/Filtering
        categories: categories_data,
        event_type: types_data, // Rinominato per chiarezza rispetto a 'type' generico
        users: user_data,
        venue_names: venue_data.names,
        localities: venue_data.localities,
        countries: venue_data.countries,

        // Campi numerici per filtri/ordinamento (timestamp)
        start_times: schedule_timestamps.start,
        end_times: schedule_timestamps.end,

        // Geo-localizzazione (potrebbe essere un array se ci sono più venue)
        // Algolia gestisce array di _geoloc, ma spesso uno è sufficiente.
        // Prendiamo il primo, se disponibile.
        _geoloc: uniqueGeolocs.length > 0 ? uniqueGeolocs[0] : null,
        // _geoloc: uniqueGeolocs, // Alternativa: inviare tutti i punti unici

        // Campi per Ranking
        visits: event.stats?.visits ?? 0, // Usa optional chaining e nullish coalescing
        likes: event.stats?.likes ?? 0,

        // Altri dati utili
        image_url: event.imageFormats?.medium, // O un altro formato dall'oggetto virtuale
        // Potremmo aggiungere qui dati dai programmi (performances, artisti) se popolati
        // program_performances: event.program?.map(p => p.performance?.title).filter(Boolean) ?? [],
        // program_artists: ... (richiede ulteriore logica di estrazione/popolazione)
    };

    // Rimuovi eventuali campi null/undefined se preferisci non inviarli
    Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);

    return record;
};


/**
 * Funzione principale per indicizzare tutti gli EventShow.
 */
const indexEventShows = async () => {
    console.log('🚀 Inizio indicizzazione EventShow...');

    if (!MONGODB_URI) {
        console.error('❌ Errore: MONGODB_URI non definito nelle variabili d\'ambiente.');
        return;
    }

    let connection;
    try {
        await loadModels();
        console.log('✅ loadModels');
    } catch (error) {
        console.error('❌ Errore durante il processo di caricamento modelli:', error);
    }
    
    try {
        // 2. Connect to Database
        const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/avnode'; // Fallback URI
        connection = await connectDB(dbUri); // Get the connection object

        console.log('✅ Connesso a MongoDB.');

        console.log('⏳ Recupero documenti EventShow...');
        // TODO: Considera .populate() qui se necessario per campi come type, categories, users, program...
        // Esempio: .populate('type categories users program.performance');
        // Attenzione: la populate può essere pesante. Seleziona solo i campi necessari!
        // Esempio populate selettivo:
        // .populate({ path: 'type', select: 'name slug' })
        // .populate({ path: 'categories', select: 'name slug' })
        // .populate({ path: 'users', select: 'stagename slug' })
        // .populate({ path: 'program.performance', select: 'title slug users', populate: { path: 'users', select: 'stagename slug' } }) // Popolazione nidificata

        const EventShow = mongoose.model('EventShow');

        const eventShows = await EventShow.find({
            is_public: true // Potresti voler indicizzare solo quelli pubblici
        })
        // Aggiungi qui .populate() se necessario
        .populate('type', 'name slug') // Popola tipo
        .populate('categories', 'name slug') // Popola categorie
        .populate('users', 'stagename slug') // Popola utenti/artisti associati direttamente all'evento
        // Nota: Popolare program/program_freezed può diventare complesso e pesante.
        // Potrebbe essere meglio gestirlo separatamente o includere solo ID/slug qui.
        .exec();
        console.log(eventShows[100])

        console.log(`✅ Trovati ${eventShows.length} documenti EventShow.`);

        if (eventShows.length === 0) {
            console.log('ℹ️ Nessun documento EventShow da indicizzare.');
            return;
        }

        console.log('⏳ Trasformazione documenti in record Algolia...');
        const algoliaRecords = eventShows.map(transformEventShowToAlgoliaRecord).filter(Boolean); // Filtra eventuali null

        console.log(`✅ Trasformati ${algoliaRecords.length} record per Algolia.`);

        if (algoliaRecords.length > 0) {
            console.log('⏳ Invio record ad Algolia...');
            // Invia in batch ad Algolia
            const res = await algoliaService.saveObjects("AVnode_Events", algoliaRecords);
            if (res?.taskID || res?.taskIDs) {
                console.log(`✅ Record inviati ad Algolia (Task ID(s): ${res.taskID ?? res.taskIDs.join(', ')})`);
            } else {
                console.error('❌ Invio ad Algolia fallito.');
            }
        } else {
            console.log('ℹ️ Nessun record valido da inviare ad Algolia.');
        }

    } catch (error) {
        console.error('❌ Errore durante il processo di indicizzazione:', error);
    } finally {
        if (connection) {
            await mongoose.disconnect();
            console.log('🔌 Disconnesso da MongoDB.');
        }
        console.log('🏁 Processo di indicizzazione EventShow terminato.');
    }
};

// Esegui la funzione principale
indexEventShows();