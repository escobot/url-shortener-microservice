'use strict';

const express = require('express');
const app = express();
const redis = require('redis');

// Middleware
app.use(express.json());
app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

const urlModel = require('./url');

// Redis
const redisClient = redis.createClient({ host: 'redis' });

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Error::' + err);
});

function hashCode(s) {
    let h;
    for (let i = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h.toString().substring(1);
}

app.get('/new/:url', function (req, res) {
    const longUrl = req.params.url.toString();
    const shortUrl = hashCode(longUrl);
    const isUrl = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(longUrl);

    if (isUrl) {
        const urlModelObject = new urlModel({ longUrl: longUrl, shortUrl: shortUrl });
        urlModelObject.save().then(function (dbResult) {
            redisClient.get(shortUrl, function (error, cacheResult) {
                if (error) {
                    res.send({ error });
                }
                if (cacheResult == null) {
                    redisClient.set(dbResult.shortUrl, dbResult.longUrl, redis.print);
                }
                res.send({ longUrl: dbResult.longUrl, shortUrl: dbResult.shortUrl });
            });
        });
    } else {
        res.send({ 'error': 'url is not valid' });
    }
})

app.get('/:url', function (req, res) {
    const shortUrl = req.params.url.toString();
    redisClient.get(shortUrl, function (error, cacheResult) {
        if (error) {
            res.send({ error });
        }
        if (cacheResult == null) {
            urlModel.find({ shortUrl: shortUrl }).limit(1).then(function (dbResult, error) {
                if (error) {
                    res.send({ error });
                }
                console.log(dbResult);
                redisClient.set(dbResult[0].shortUrl.toString(), dbResult[0].longUrl.toString(), redis.print);
                res.status(301).redirect('https://' + dbResult[0].longUrl.toString());
            });
        } else {
            res.status(301).redirect('https://' + cacheResult);
        }
    });
})

module.exports = app;