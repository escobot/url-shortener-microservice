const express = require('express');
const app = express();

const { generateShortUrl, getLongUrl } = require('./services/url.service');

app.use(express.json());

app.get('/new/:url', generateShortUrl);
app.get('/get/:url', getLongUrl);

module.exports = app;