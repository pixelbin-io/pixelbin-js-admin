const OauthClient = require("./OAuthClient");
class PixelbinConfig {
    /**
     * Initializes the client with the provided configuration.
     * This configuration will set up the domain and authentication details for API requests.
     * It also allows for the specification of a custom `User-Agent` string via `integrationPlatform`.
     *
     * @param {Object} config - The configuration object for the client.
     * @param {string} config.domain - The base URL of the API service. This should be a fully qualified domain name.
     * @param {string} config.apiSecret - The secret key used for API authentication. Ensure this is kept secure.
     * @param {string} [config.integrationPlatform] - An optional string to customize the `User-Agent` header for outgoing requests.
     * This can be used to specify details about the software or plugin making the API request, such as its name and version.
     *
     * @example
     * // Example of initializing the client with a configuration.
     * initializeClient({
     *   domain: 'https://api.example.com',
     *   apiSecret: 'your_secret_key',
     *   integrationPlatform: 'YourAppName/1.0 (AppPlatform/2.0)'
     * });
     */
    constructor(config) {
        this.domain = config.domain || "https://api.pixelbin.io";
        this.apiSecret = config.apiSecret;
        this.oauthClient = new OauthClient(this);
        this.integrationPlatform = config.integrationPlatform;
    }
    async getAccessToken() {
        let token = await this.oauthClient.getAccessToken();
        return token;
    }
}

module.exports = PixelbinConfig;
