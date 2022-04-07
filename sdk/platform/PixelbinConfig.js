const OauthClient = require("./OAuthClient");
class PixelbinConfig {
    /**
     * @param  {Object} config
     * @param  {string} config.domain
     * @param  {string} config.apiSecret
     */
    constructor(config) {
        this.domain = config.domain || "https://api.pixelbin.io";
        this.apiSecret = config.apiSecret;
        this.oauthClient = new OauthClient(this);
    }
    async getAccessToken() {
        let token = await this.oauthClient.getAccessToken();
        return token;
    }
}

module.exports = PixelbinConfig;
