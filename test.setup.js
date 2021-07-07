const { buildRedisClient } = require('./services/redis');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { RedisMemoryServer } = require('redis-memory-server');

let mongo;
let redisClient;
let redisServer;

beforeAll(async () => {
    // MongoDB
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Redis
    redisServer = new RedisMemoryServer();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    redisClient = buildRedisClient({
      host,
      port,
    });
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();

    await redisClient.end(true);;
    await redisServer.stop();
});
