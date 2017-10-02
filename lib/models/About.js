var Schema = require('mongoose').Schema;

module.exports = new Schema({
    lang: String,
    abouttext: String,
    is_primary: { type: Boolean, default: false }
}, { collection: 'abouts' });