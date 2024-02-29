const hmacSHA256 = require("crypto-js/hmac-sha256");
const { PDKIllegalArgumentError } = require("../../common/PDKError");

function generateSignature(urlPath, expiryTimestamp, key) {
    if (urlPath.startsWith("/")) urlPath = urlPath.substring(1);
    urlPath = encodeURI(urlPath);
    const hash = hmacSHA256(urlPath + expiryTimestamp, key);
    return hash.toString();
}

const generateSignedURL = (url, expirySeconds, accessKey, token) => {
    if (!url || !accessKey || !token || !expirySeconds)
        throw new PDKIllegalArgumentError(
            "url, accessKey, token & expirySeconds are required for generating signed URL",
        );

    if (!(typeof expirySeconds === "number"))
        throw new PDKIllegalArgumentError(
            `Expected expirySeconds to be a Number. Got ${typeof expirySeconds} instead`,
        );

    const urlObj = new URL(url);
    const urlPath = urlObj.pathname + urlObj.search;

    if (urlObj.searchParams.has("pbs"))
        throw new PDKIllegalArgumentError("URL already has a signature");

    const expiryTimestamp = Math.floor(Date.now() / 1000) + expirySeconds;

    const signature = generateSignature(urlPath, expiryTimestamp, token);

    urlObj.searchParams.set("pbs", signature);
    urlObj.searchParams.set("pbe", expiryTimestamp);
    urlObj.searchParams.set("pbt", accessKey);

    return urlObj.toString();
};

module.exports = { generateSignedURL };
