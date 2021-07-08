const URL = require('../models/url');
const redisClient = require('../services/redis');
const { hash } = require('../services/hash');
const { validateUrl } = require('../services/validation');

exports.generateShortUrl = function (req, res) {
    const longUrl = req.params.url.toString();
    const isValidUrl = validateUrl(longUrl);

    if (isValidUrl) {
        const shortUrl = hash(longUrl, 'crc32');

        const newUrl = new URL({ longUrl: longUrl, shortUrl: shortUrl });

        newUrl.save().then(function (dbResult) {
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

exports.getLongUrl = function (req, res) {
    const shortUrl = req.params.url.toString();

    redisClient.get(shortUrl, function (error, cacheResult) {
        if (error) {
            res.send({ error });
        }
        if (cacheResult == null) {
            URL.find({ shortUrl: shortUrl }).limit(1).then(function (dbResult, error) {
                if (error) {
                    res.send({ error });
                }
                if (!dbResult.length) {
                    res.status(404).send({'error': 'The requested resource was not found'});
                } else {
                    redisClient.set(dbResult[0].shortUrl.toString(), dbResult[0].longUrl.toString());
                    res.status(301).redirect('https://' + dbResult[0].longUrl.toString());
                }
            });
        } else {
            res.status(301).redirect('https://' + cacheResult);
        }
    });
};