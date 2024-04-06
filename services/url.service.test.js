const {generateShortUrl, getLongUrl} = require('./url.service');
const Url = require('../models/url');
const redisClient = require('../utils/redis');
const {validateUrl} = require('../utils/validation');
const httpMocks = require('node-mocks-http'); // For mocking req, res objects

// mocks
jest.mock('../models/url');
jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
            if (event === 'connect') {
                console.log('Mock Redis client connected');
            }
        }),
        get: jest.fn(),
        set: jest.fn(),
    }),
}));
jest.mock('../utils/validation', () => ({
    validateUrl: jest.fn().mockReturnValue(true),
}));


describe('URL Shortening Service', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Url.mockClear();
        redisClient.get.mockClear();
        redisClient.set.mockClear();
        validateUrl.mockClear();
    });

    describe('generateShortUrl', () => {
        it('should generate a short URL and save it to both MongoDB and Redis', async () => {
            const req = httpMocks.createRequest({
                params: {
                    url: 'http://example.com',
                },
            });
            const res = httpMocks.createResponse();

            // Mock Url model save method
            const mockSave = jest.fn().mockResolvedValue({
                longUrl: req.params.url,
                shortUrl: 'hashedUrl'
            });
            Url.mockImplementation(() => ({
                save: mockSave
            }));

            // Mock redisClient get and set
            redisClient.get.mockImplementation((key, callback) => callback(null, null));
            redisClient.set.mockImplementation(() => {});

            await generateShortUrl(req, res);

            // Assertions
            expect(validateUrl).toHaveBeenCalledWith(req.params.url);
            expect(mockSave).toHaveBeenCalled();
            expect(redisClient.set).toHaveBeenCalledWith('hashedUrl', req.params.url);
            expect(res._getData()).toEqual({
                longUrl: req.params.url,
                shortUrl: 'hashedUrl'
            });
        });
    });

    describe('getLongUrl', () => {
        it('should redirect to the long URL when found in Redis', async () => {
            const req = httpMocks.createRequest({
                params: {
                    url: 'hashedUrl',
                },
            });
            const res = httpMocks.createResponse();

            // Mock redisClient get to return a long URL
            redisClient.get.mockImplementation((key, callback) => callback(null, 'http://example.com'));

            await getLongUrl(req, res);

            // Assertions
            expect(redisClient.get).toHaveBeenCalledWith('hashedUrl', expect.any(Function));
            expect(res._getRedirectUrl()).toEqual('https://http://example.com');
        });
    });
});