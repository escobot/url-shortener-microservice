const redis = require('redis');

const redisClient = redis.createClient({ host: 'redis' });

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.error(err);
});

module.exports = redisClient;