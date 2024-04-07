exports.validateUrl = function (url) {
    if (url.length > 200) {
        throw new Error("URL exceeds the maximum length of 200 characters");
    }
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w.-]+)?\/?$/;
    return regex.test(url);    
};
