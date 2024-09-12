const { PixelbinConfig, PixelbinClient } = require("../..");
const { pdkAxios } = require("../../sdk/common/AxiosHelper");

describe("User-Agent Header Test", () => {
    it("should be able to set user-agent based on integrationPlatform ", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
            integrationPlatform: "Erasebg Plugin/1.2.3 (Figma/3.2.1)",
        });

        const requestMock = jest.spyOn(pdkAxios, "request");

        const getUsageResponse = {
            usage: {
                storage: 101730347423394,
            },
            credits: {
                used: 2100468.720988592,
            },
            total: {
                storage: 100000,
                credits: 100000,
            },
        };

        requestMock.mockResolvedValue(getUsageResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.billing.getUsage();

        expect(response).toBe(getUsageResponse);
        expect(requestMock.mock.calls[0][0].headers["user-agent"]).toEqual(
            `Erasebg Plugin/1.2.3 (Figma/3.2.1)`,
        );
        requestMock.mockRestore();
    });

    it("should correctly set the User-Agent header incase no integerationPlatform is set", async () => {
        const userAgentInterceptor = pdkAxios.interceptors.request.handlers[0].fulfilled;
        const config = await userAgentInterceptor({ headers: {} });
        let userAgent = `@pixelbin/admin/4.1.1 (JavaScript)`;
        expect(config.headers["user-agent"]).toEqual(userAgent);
    });

    it("should correctly set the User-Agent header incase integerationPlatform is set", async () => {
        const userAgentInterceptor = pdkAxios.interceptors.request.handlers[0].fulfilled;
        const interceptedConfig = await userAgentInterceptor({
            headers: { "user-agent": "Erasebg Plugin/1.2.3 (Figma/3.2.1)" },
        });
        let userAgent = `Erasebg Plugin/1.2.3 (Figma/3.2.1) @pixelbin/admin/4.1.1 (JavaScript)`;
        expect(interceptedConfig.headers["user-agent"]).toEqual(userAgent);
    });
});
