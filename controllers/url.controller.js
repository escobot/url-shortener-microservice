const urlModel = require('../models/url');
const redisClient = require('../services/redis');
const { hash } = require('../services/hash');

exports.generateShortUrl = function (req, res) {
    const longUrl = req.params.url.toString();
    const shortUrl = hash(longUrl, 'crc32');
    const isUrl = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(longUrl);

    if (isUrl) {
        const urlModelObject = new urlModel({ longUrl: longUrl, shortUrl: shortUrl });
        urlModelObject.save().then(function (dbResult) {
            redisClient.get(shortUrl, function (error, cacheResult) {
                if (error) {
                    res.send({ error });
                }
                if (cacheResult == null) {
                    redisClient.set(dbResult.shortUrl, dbResult.longUrl);
                }
                res.send({ longUrl: dbResult.longUrl, shortUrl: dbResult.shortUrl });
            });
        });
    } else {
        res.send({ 'error': 'url is not valid' });
    }
};

exports.getShortUrl = function (req, res) {
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
                redisClient.set(dbResult[0].shortUrl.toString(), dbResult[0].longUrl.toString());
                res.status(301).redirect('https://' + dbResult[0].longUrl.toString());
            });
        } else {
            res.status(301).redirect('https://' + cacheResult);
        }
    });
};