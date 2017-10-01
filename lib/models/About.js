var Schema = require('mongoose').Schema;

module.exports = new Schema({
    lang: String,
    abouttext: String,
}, { collection: 'abouts' });