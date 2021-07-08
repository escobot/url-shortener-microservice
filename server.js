const express = require('express');
const app = express();

const { generateShortUrl, getLongUrl } = require('./controllers/url.controller');

app.use(express.json());

app.get('/new/:url', generateShortUrl);
app.get('/get/:url', getLongUrl);

module.exports = app;