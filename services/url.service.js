const Url = require('../models/url');
const redisClient = require('../utils/redis');
const { hash } = require('../utils/hash');
const { validateUrl } = require('../utils/validation');

exports.generateShortUrl = async function (req, res) {
    const longUrl = req.params.url.toString();
    const isValidUrl = validateUrl(longUrl);

    if (!isValidUrl) {
        return res.status(400).send({ 'error': 'url is not valid' });
    }

    const shortUrl = hash(longUrl, 'crc32');
    const newUrl = new Url({ longUrl: longUrl, shortUrl: shortUrl });

    try {
        const dbResult = await newUrl.save();
        let cacheResult = await redisClient.get(shortUrl);
        if (cacheResult == null) {
            await redisClient.set(dbResult.shortUrl, dbResult.longUrl);
        }
        res.send({ longUrl: dbResult.longUrl, shortUrl: dbResult.shortUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send({ 'error': 'error creating url' });
    }
};

exports.getLongUrl = async function (req, res) {
    const shortUrl = req.params.url.toString();

    try {
        let cacheResult = await redisClient.get(shortUrl);
        if (cacheResult == null) {
            let dbResult = await Url.find({ shortUrl: shortUrl }).limit(1);
            if (dbResult.length === 0) {
                return res.status(404).send({'error': 'The requested resource was not found'});
            }
            await redisClient.set(dbResult[0].shortUrl.toString(), dbResult[0].longUrl.toString());
            return res.status(301).redirect('https://' + dbResult[0].longUrl.toString());
        } else {
            return res.status(301).redirect('https://' + cacheResult);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ 'error': error.message });
    }
};