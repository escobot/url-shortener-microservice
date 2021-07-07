const { validateUrl } = require('./validation');

describe("validation service", () => {
    
    it('should detect valid URLs', () => {
        expect(validateUrl('google.com')).toBeTruthy();
        expect(validateUrl('www.google.com')).toBeTruthy();
        expect(validateUrl('https://www.google.com')).toBeTruthy();
        expect(validateUrl('google.ca')).toBeTruthy();
        expect(validateUrl('www.google.ca')).toBeTruthy();
        expect(validateUrl('https://www.google.ca')).toBeTruthy();
        expect(validateUrl('facebook.com')).toBeTruthy();
        expect(validateUrl('www.facebook.com')).toBeTruthy();
        expect(validateUrl('https://www.facebook.com')).toBeTruthy();
        expect(validateUrl('twitter.com')).toBeTruthy();
        expect(validateUrl('www.twitter.com')).toBeTruthy();
        expect(validateUrl('https://www.twitter.com')).toBeTruthy();
    });

    it('should detect invalid URLs', () => {
        expect(validateUrl('.com')).toBeFalsy();
        expect(validateUrl('google')).toBeFalsy();
        expect(validateUrl('https://www.')).toBeFalsy();
        expect(validateUrl('1')).toBeFalsy();
    });
});