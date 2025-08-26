const FormData = require("form-data");
const { PixelbinClient, PixelbinConfig } = require("../..");
const { pdkAxios, uploaderAxios } = require("../../sdk/common/AxiosHelper");
const { Readable } = require("stream");
const { PDKServerResponseError } = require("../../sdk/common/PDKError");

describe("Uploader", () => {
  const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
  });
  const pixelbin = new PixelbinClient(config);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should support uploading from buffer", async () => {
    const requestMock = jest.spyOn(pdkAxios, "request");
    const createSignedUrlV2Response = {
      presignedUrl: {
        url: "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        fields: {
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      },
    };
    requestMock.mockResolvedValue(createSignedUrlV2Response);

    const axiosPutSpy = jest.spyOn(uploaderAxios, "put").mockResolvedValue();

    const mockResponse = {
      _id: "d815931c-f05e-4fa8-af29-672463b2a8ab",
      url: "https://cdn.pixelbin.io/v2/black-surf-ac93df/original/admin-dev.txt",
    };
    const axiosPostSpy = jest
      .spyOn(uploaderAxios, "post")
      .mockResolvedValue(mockResponse);

    const buffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB buffer
    const res = await pixelbin.uploader.upload({
      file: buffer,
      name: "filename666666",
      path: "",
      format: "jpeg",
      tags: [],
      metadata: { source: "signedUrl" },
      overwrite: false,
      filenameOverride: false,
      access: "public-read",
      expiry: 2000,
    });

    expect(res).toEqual(mockResponse);

    expect(requestMock.mock.calls[0][0]).toEqual({
      baseURL: config.domain,
      method: "post",
      url: "/service/platform/assets/v2.0/upload/signed-url",
      params: {},
      data: {
        access: "public-read",
        expiry: 2000,
        filenameOverride: false,
        format: "jpeg",
        metadata: {
          source: "signedUrl",
        },
        name: "filename666666",
        overwrite: false,
        path: "",
        tags: [],
      },
      headers: {
        Authorization: `Bearer ${Buffer.from("API_TOKEN").toString("base64")}`,
      },
      maxBodyLength: Infinity,
    });

    expect(axiosPutSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=2",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
    ]);

    expect(axiosPostSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        {
          parts: [1, 2],
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      ],
    ]);
  });

  it("should support uploading from stream", async () => {
    const requestMock = jest.spyOn(pdkAxios, "request");
    const createSignedUrlV2Response = {
      presignedUrl: {
        url: "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        fields: {
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      },
    };
    requestMock.mockResolvedValue(createSignedUrlV2Response);

    const axiosPutSpy = jest.spyOn(uploaderAxios, "put").mockResolvedValue();

    const mockResponse = {
      _id: "d815931c-f05e-4fa8-af29-672463b2a8ab",
      url: "https://cdn.pixelbin.io/v2/black-surf-ac93df/original/admin-dev.txt",
    };
    const axiosPostSpy = jest
      .spyOn(uploaderAxios, "post")
      .mockResolvedValue(mockResponse);

    const buffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB buffer
    const stream = Readable.from(buffer);

    const res = await pixelbin.uploader.upload({
      file: stream,
      name: "filename666666",
      path: "",
      format: "jpeg",
      tags: [],
      metadata: { source: "signedUrl" },
      overwrite: false,
      filenameOverride: false,
      access: "public-read",
      expiry: 2000,
      uploadOptions: {
        chunkSize: 5 * 1024 * 1024,
        concurrency: 2,
      },
    });

    expect(res).toEqual(mockResponse);

    expect(requestMock.mock.calls[0][0]).toEqual({
      baseURL: config.domain,
      method: "post",
      url: "/service/platform/assets/v2.0/upload/signed-url",
      params: {},
      data: {
        access: "public-read",
        expiry: 2000,
        filenameOverride: false,
        format: "jpeg",
        metadata: {
          source: "signedUrl",
        },
        name: "filename666666",
        overwrite: false,
        path: "",
        tags: [],
      },
      headers: {
        Authorization: `Bearer ${Buffer.from("API_TOKEN").toString("base64")}`,
      },
      maxBodyLength: Infinity,
    });

    expect(axiosPutSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=2",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=3",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=4",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
    ]);

    expect(axiosPostSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        {
          parts: [1, 2, 3, 4],
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      ],
    ]);
  });

  it("should retry on failure", async () => {
    const requestMock = jest.spyOn(pdkAxios, "request");
    const createSignedUrlV2Response = {
      presignedUrl: {
        url: "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        fields: {
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      },
    };
    requestMock.mockResolvedValue(createSignedUrlV2Response);

    const axiosPutSpy = jest
      .spyOn(uploaderAxios, "put")
      .mockRejectedValueOnce(
        new PDKServerResponseError("Test Error Post", "", "", 503),
      )
      .mockResolvedValue(null);

    const mockResponse = {
      _id: "d815931c-f05e-4fa8-af29-672463b2a8ab",
      url: "https://cdn.pixelbin.io/v2/black-surf-ac93df/original/admin-dev.txt",
    };

    const axiosPostSpy = jest
      .spyOn(uploaderAxios, "post")
      .mockRejectedValueOnce(
        new PDKServerResponseError("Test Error Post", "", "", 503),
      )
      .mockResolvedValue(mockResponse);

    const buffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB buffer
    const res = await pixelbin.uploader.upload({
      file: buffer,
      name: "filename666666",
      path: "",
      format: "jpeg",
      tags: [],
      metadata: { source: "signedUrl" },
      overwrite: false,
      filenameOverride: false,
      access: "public-read",
      expiry: 2000,
      uploadOptions: {
        maxRetries: 1,
        exponentialFactor: 1,
      },
    });

    expect(res).toEqual(mockResponse);

    expect(requestMock.mock.calls[0][0]).toEqual({
      baseURL: config.domain,
      method: "post",
      url: "/service/platform/assets/v2.0/upload/signed-url",
      params: {},
      data: {
        access: "public-read",
        expiry: 2000,
        filenameOverride: false,
        format: "jpeg",
        metadata: {
          source: "signedUrl",
        },
        name: "filename666666",
        overwrite: false,
        path: "",
        tags: [],
      },
      headers: {
        Authorization: `Bearer ${Buffer.from("API_TOKEN").toString("base64")}`,
      },
      maxBodyLength: Infinity,
    });

    expect(axiosPutSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=2",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
    ]);

    expect(axiosPostSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        {
          parts: [1, 2],
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        {
          parts: [1, 2],
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      ],
    ]);
  });

  it("should not retry on 4xx errors - chunk Upload", async () => {
    const requestMock = jest.spyOn(pdkAxios, "request");
    const createSignedUrlV2Response = {
      presignedUrl: {
        url: "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        fields: {
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      },
    };
    requestMock.mockResolvedValue(createSignedUrlV2Response);

    const axiosPutSpy = jest
      .spyOn(uploaderAxios, "put")
      .mockRejectedValueOnce(
        new PDKServerResponseError("Test Error Put", "", "", 422),
      );

    const axiosPostSpy = jest.spyOn(uploaderAxios, "post");

    const buffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB buffer
    await expect(
      pixelbin.uploader.upload({
        file: buffer,
        name: "filename666666",
        path: "",
        format: "jpeg",
        tags: [],
        metadata: { source: "signedUrl" },
        overwrite: false,
        filenameOverride: false,
        access: "public-read",
        expiry: 2000,
        uploadOptions: {
          maxRetries: 1,
          exponentialFactor: 1,
        },
      }),
    ).rejects.toEqual(
      new PDKServerResponseError("Test Error Put", "", "", 422),
    );

    expect(axiosPutSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=2",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
    ]);

    expect(axiosPostSpy.mock.calls).toEqual([]);
  });

  it("should not retry on 4xx errors - Complete Upload", async () => {
    const requestMock = jest.spyOn(pdkAxios, "request");
    const createSignedUrlV2Response = {
      presignedUrl: {
        url: "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        fields: {
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      },
    };
    requestMock.mockResolvedValue(createSignedUrlV2Response);

    const axiosPutSpy = jest.spyOn(uploaderAxios, "put").mockResolvedValue();

    const axiosPostSpy = jest
      .spyOn(uploaderAxios, "post")
      .mockRejectedValueOnce(
        new PDKServerResponseError("Test Error Post", "", "", 422),
      );

    const buffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB buffer
    await expect(
      pixelbin.uploader.upload({
        file: buffer,
        name: "filename666666",
        path: "",
        format: "jpeg",
        tags: [],
        metadata: { source: "signedUrl" },
        overwrite: false,
        filenameOverride: false,
        access: "public-read",
        expiry: 2000,
        uploadOptions: {
          maxRetries: 1,
          exponentialFactor: 1,
        },
      }),
    ).rejects.toEqual(
      new PDKServerResponseError("Test Error Post", "", "", 422),
    );

    expect(axiosPutSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=1",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5&partNumber=2",
        expect.any(FormData),
        {
          headers: {
            "content-type": expect.stringMatching(
              /^multipart\/form-data; boundary=.*/,
            ),
          },
          maxBodyLength: Infinity,
        },
      ],
    ]);

    expect(axiosPostSpy.mock.calls).toEqual([
      [
        "https://api.pixelbin.io/service/public/assets/v1.0/signed-multipart?pbs=8b49e6cdd445ceda287b160db2a6f5cf50109ea062b696e4e6be379aa4396e1a&pbe=1700600070390&pbt=92661&pbo=143209&pbu=5fe187e8-8649-4546-9a28-ff551839e0f5",
        {
          parts: [1, 2],
          "x-pixb-meta-assetdata":
            '{"orgId":143209,"type":"file","name":"filename666666","path":"","fileId":"filename666666.jpeg","format":"jpeg","s3Bucket":"erase-erase-erasebg-assets","s3Key":"uploads/floral-moon-9617c8/original/a34f1de1-28bf-489c-9aff-cc549ac9e003.jpeg","access":"public-read","tags":[],"metadata":{"source":"signedUrl","publicUploadId":"5fe187e8-8649-4546-9a28-ff551839e0f5"},"overwrite":false,"filenameOverride":false}',
        },
      ],
    ]);
  });
});
