const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create url schema & model
const UrlSchema = new Schema({
    shortUrl: String,
    longUrl: String
});

const Url = mongoose.model('urls',UrlSchema);

module.exports = Url;