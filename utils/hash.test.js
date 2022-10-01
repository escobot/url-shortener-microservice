const { hash } = require('./hash');

describe("hash service", () => {
    
    it('should hash the url to the same value all the time', () => {
        expect(hash('www.google.com', 'crc32')).toEqual('1f63b7d1');
        expect(hash('www.facebook.com', 'crc32')).toEqual('33c728d9');
        expect(hash('www.twitter.com', 'crc32')).toEqual('6909b46c');
    });

    it('should return a hash of 8 characters', () => {
        expect(hash('www.google.com', 'crc32').length).toEqual(8);
        expect(hash('www.facebook.com', 'crc32').length).toEqual(8);
        expect(hash('www.twitter.com', 'crc32').length).toEqual(8);
    });

    it('should return a different has for different values', () => {
        let hash1 = hash('www.google.com', 'crc32');
        let hash2 = hash('www.google.ca', 'crc32');
        let hash3 = hash('https://www.google.com', 'crc32');
        let hash4 = hash('https://www.google.ca', 'crc32');
        expect(hash1  === hash2 === hash3 === hash4).toBeFalsy();
    });
});