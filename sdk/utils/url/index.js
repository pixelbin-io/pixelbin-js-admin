const { getObjFromUrl, getUrlFromObj } = require("./utils");

const config = {
    operationSeparator: "~",
    parameterSeparator: ",",
};

const urlToObj = function (url) {
    return getObjFromUrl(url, config, false);
};

const objToUrl = function (obj) {
    return getUrlFromObj(obj, config);
};

module.exports = { urlToObj, objToUrl };
