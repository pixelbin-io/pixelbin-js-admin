const { generateSignedURL } = require("./signedUrl");

/**
 
Sign a PixelBin URL
@param {string} url - The URL to be signed. 
@param {Number} expirySeconds - The number of seconds the signed URL should be valid for.
@param {Number} tokenId - The ID of the token used. 
@param {string} token - The token value.
@returns {string} - The signed URL
*/

const signURL = function (url, expirySeconds, tokenId, token) {
    return generateSignedURL(url, expirySeconds, tokenId, token);
};

module.exports = { signURL };
