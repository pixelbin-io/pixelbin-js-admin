const { pdkAxios } = require("../common/AxiosHelper");

class APIClient {
    /**
     * @param  {object} conf
     * @param  {string} method
     * @param  {string} url
     * @param  {object} query
     * @param  {object} body
     */
    static execute(conf, method, url, query, body, contentType) {
        const token = Buffer.from(conf.oauthClient.getAccessToken()).toString("base64");
        let headers = {};
        if (contentType === "multipart/form-data")
            headers = {
                ...body.getHeaders(),
            };
        const rawRequest = {
            baseURL: conf.domain,
            method: method,
            url: url,
            params: query,
            data: body,
            headers: {
                "user-agent": conf.integrationPlatform,
                Authorization: "Bearer " + token,
                ...headers,
            },
            maxBodyLength: Infinity,
        };

        return pdkAxios.request(rawRequest);
    }

    async get(url, config) {
        let access_token = await this.configuration.getAccessToken();
        config = config || {};
        config.headers = config.headers || {};
        config.headers.Authorization = "Bearer " + access_token;
        return axios.get(url);
    }
}
module.exports = APIClient;
