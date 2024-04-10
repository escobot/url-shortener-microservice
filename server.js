const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

const { generateShortUrl, getLongUrl } = require('./services/url.service');

app.use(express.json());

app.get('/new/:url', rateLimiter, generateShortUrl);
app.get('/get/:url', rateLimiter, getLongUrl);

module.exports = app;