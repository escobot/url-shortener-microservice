const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create url schema & model
const UrlSchema = new Schema({
    shortUrl: {
        type: String,
        unique: true
    },
    longUrl: {
        type: String,
        unique: true
    }
}, {autoIndex: true});

const Url = mongoose.model('urls',UrlSchema);

module.exports = Url;