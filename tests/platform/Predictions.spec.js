const { PixelbinConfig, PixelbinClient } = require("../..");
const { pdkAxios } = require("../../sdk/common/AxiosHelper");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");

describe("Predictions", () => {
  it("should create a prediction with multipart form-data", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    const sampleResponse = {
      input: {
        image:
          "https://delivery.pixelbin.io/predictions/inputs/erase/bg/0198a23e/image/0.jpeg",
      },
      status: "ACCEPTED",
      urls: {
        get: "https://api.pixelbin.io/service/platform/transformation/v1.0/predictions/erase--bg--0198a23e",
      },
      _id: "erase--bg--0198a23e",
    };
    requestMock.mockResolvedValue(sampleResponse);

    const pixelbin = new PixelbinClient(config);
    const res = await pixelbin.predictions.create({
      name: "erase_bg",
      input: {
        image: Buffer.from("dummy"),
        industry_type: "general",
        quality_type: "original",
        shadow: "false",
        refine: "true",
      },
    });

    expect(res).toBe(sampleResponse);
    expect(requestMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        baseURL: config.domain,
        method: "post",
        url: "/service/platform/transformation/v1.0/predictions/erase/bg",
        params: {},
        headers: expect.objectContaining({
          Authorization: `Bearer ${Buffer.from("test-api-secret").toString(
            "base64",
          )}`,
          "content-type": expect.stringMatching(
            /^multipart\/form-data; boundary=.*/,
          ),
        }),
        maxBodyLength: Infinity,
      }),
    );
    expect(requestMock.mock.calls[0][0].data).toBeInstanceOf(FormData);
    requestMock.mockRestore();
  });

  it("should treat only Buffer/Stream as files; strings are not file paths", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    requestMock.mockResolvedValue({ _id: "rid" });

    const existsMock = jest.spyOn(fs, "existsSync");
    existsMock.mockImplementation(() => false);

    const pixelbin = new PixelbinClient(config);
    await pixelbin.predictions.create({
      name: "erase_bg",
      input: {
        mask: Buffer.from("x"),
        image: Readable.from(Buffer.from("x")),
        industry_type: "general",
        quality_type: "original",
        shadow: "false",
        refine: "true",
      },
    });

    const form = requestMock.mock.calls[0][0].data;
    expect(form).toBeInstanceOf(FormData);
    // ensure we did not attempt to read any file paths
    expect(existsMock).not.toHaveBeenCalled();

    requestMock.mockRestore();
    existsMock.mockRestore();
  });

  it("should get prediction details by requestId using get", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    const statusResponse = {
      status: "SUCCESS",
      _id: "erase--bg--0198a23e",
      output: [
        "https://delivery.pixelbin.io/predictions/outputs/30d/erase/bg/0198a23e/result_0.png",
      ],
    };
    requestMock.mockResolvedValue(statusResponse);

    const pixelbin = new PixelbinClient(config);
    const byId = await pixelbin.predictions.get("erase--bg--0198a23e");
    expect(byId).toBe(statusResponse);
    const lastCall =
      requestMock.mock.calls[requestMock.mock.calls.length - 1][0];
    expect(lastCall).toEqual(
      expect.objectContaining({
        baseURL: config.domain,
        method: "get",
        url: "/service/platform/transformation/v1.0/predictions/erase--bg--0198a23e",
        params: {},
        headers: expect.objectContaining({
          Authorization: `Bearer ${Buffer.from("test-api-secret").toString(
            "base64",
          )}`,
        }),
        maxBodyLength: Infinity,
      }),
    );

    requestMock.mockRestore();
  });

  it("should wait with provided requestId using default retry settings", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    requestMock
      .mockResolvedValueOnce({ status: "ACCEPTED", _id: "rid" })
      .mockResolvedValueOnce({
        status: "SUCCESS",
        _id: "rid",
        output: "hello",
      });

    const pixelbin = new PixelbinClient(config);
    const status = await pixelbin.predictions.wait("erase--bg--rid");
    expect(status.status).toBe("SUCCESS");
    requestMock.mockRestore();
  });

  it("should wait with custom options (maxAttempts, retryFactor, retryInterval)", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    requestMock
      .mockResolvedValueOnce({ status: "ACCEPTED", _id: "rid" })
      .mockResolvedValueOnce({ status: "SUCCESS", _id: "rid", output: "ok" });

    const pixelbin = new PixelbinClient(config);
    const status = await pixelbin.predictions.wait("erase--bg--rid", {
      maxAttempts: 200, // should clamp to 150
      retryFactor: 10, // should clamp to 3
      retryInterval: 10, // should clamp to >= 1000
    });
    expect(status.status).toBe("SUCCESS");
    requestMock.mockRestore();
  });

  it("should createAndWait and return final result only", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "test-api-secret",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    // create
    requestMock.mockResolvedValueOnce({ _id: "rid", status: "ACCEPTED" });
    // wait -> success
    requestMock.mockResolvedValueOnce({ status: "SUCCESS", _id: "rid" });

    const pixelbin = new PixelbinClient(config);
    const result = await pixelbin.predictions.createAndWait({
      name: "erase_bg",
      input: { image: Buffer.from("x") },
      options: { maxAttempts: 1, retryFactor: 1, retryInterval: 1 },
    });
    expect(result.status).toBe("SUCCESS");
    requestMock.mockRestore();
  });

  it("should list predictions from public API", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "k",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    const listResponse = [
      {
        name: "erase_bg",
        displayName: "Erase Background",
        description: "Removes image background.",
        bannerImage:
          "https://cdn.pixelbin.io/v2/dummy-cloudname/t.resize(h:360,w:540)/prediction_api_banner_images/erase-bg.png",
      },
    ];
    requestMock.mockResolvedValue(listResponse);

    const pixelbin = new PixelbinClient(config);
    const items = await pixelbin.predictions.list();
    expect(items).toBe(listResponse);
    const call = requestMock.mock.calls[0][0];
    expect(call).toEqual(
      expect.objectContaining({
        baseURL: config.domain,
        method: "get",
        url: "/service/public/transformation/v1.0/predictions",
        params: {},
      }),
    );
    requestMock.mockRestore();
  });

  it("should get prediction schema by name from public API", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "k",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    const schemaResponse = {
      name: "erase_bg",
      displayName: "Erase Background",
      input: { image: { oneOf: [] } },
    };
    requestMock.mockResolvedValue(schemaResponse);

    const pixelbin = new PixelbinClient(config);
    const schema = await pixelbin.predictions.getSchema("erase_bg");
    expect(schema).toBe(schemaResponse);
    const call = requestMock.mock.calls[0][0];
    expect(call).toEqual(
      expect.objectContaining({
        baseURL: config.domain,
        method: "get",
        url: "/service/public/transformation/v1.0/predictions/schema/erase_bg",
        params: {},
      }),
    );
    requestMock.mockRestore();
  });

  it("should include webhook in create body when provided", async () => {
    const config = new PixelbinConfig({
      domain: "https://api.testdomain.com",
      apiSecret: "k",
    });
    const requestMock = jest.spyOn(pdkAxios, "request");
    requestMock.mockResolvedValue({ _id: "x" });

    const pixelbin = new PixelbinClient(config);
    await pixelbin.predictions.create({
      name: "erase_bg",
      input: { image: Buffer.from("dummy") },
      webhook: "https://example.com/webhook",
    });

    const form = requestMock.mock.calls[0][0].data;
    expect(form).toBeInstanceOf(FormData);
    const formStr = form.getBuffer().toString("utf8");
    expect(formStr).toContain('form-data; name="webhook"');
    expect(formStr).toContain("https://example.com/webhook");
    requestMock.mockRestore();
  });
});
