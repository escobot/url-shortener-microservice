const express = require('express');
const app = express();

const { generateShortUrl, getShortUrl } = require('./controllers/url.controller');

app.use(express.json());

app.get('/new/:url', generateShortUrl);
app.get('/:url', getShortUrl);

module.exports = app;