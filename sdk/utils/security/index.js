const { generateSignedURL } = require("./signedUrl");

/**
 
Sign a PixelBin URL
@param {string} url - The URL to be signed. 
@param {Number} expirySeconds - The number of seconds the signed URL should be valid for.
@param {string} accessKey - The access key of the token used. 
@param {string} token - The token value.
@returns {string} - The signed URL
*/

const signURL = function (url, expirySeconds, accessKey, token) {
    return generateSignedURL(url, expirySeconds, accessKey, token);
};

module.exports = { signURL };
