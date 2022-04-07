class OAuthClient {
    constructor(config) {
        this.config = config;
        this.token = config.apiSecret;
    }

    getAccessToken() {
        return this.token;
    }
}

module.exports = OAuthClient;
