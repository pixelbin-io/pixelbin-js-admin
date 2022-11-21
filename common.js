const { pdkAxios } = require("./sdk/common/AxiosHelper");
const url = require("./sdk/utils/url");
const assetUtils = require("./sdk/utils/asset.utils");

module.exports = {
    PdkAxios: pdkAxios,
    url: url,
    utils: {
        url,
        assets: assetUtils,
    },
};
