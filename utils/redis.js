const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://redis'
});

redisClient.connect();

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.error('Redis client error', err);
});

module.exports = redisClient;