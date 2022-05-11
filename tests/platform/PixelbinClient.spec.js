const { PixelbinConfig, PixelbinClient } = require("../..");
const { pdkAxios } = require("../../sdk/common/AxiosHelper");
const FormData = require("form-data");
const fs = require("fs");

describe("Pixelbin Client", () => {
    const exploreResponse = {
        items: [
            {
                _id: "3f6a178e-da7e-4637-9f58-9fcd8344d2b4",
                createdAt: "2022-02-13T14:20:54.315Z",
                updatedAt: "2022-02-13T14:20:54.315Z",
                fileId: "1024x1024",
                path: "",
                name: "1024x1024",
                format: "png",
                type: "file",
                size: 26311,
                tags: [],
                metadata: [Object],
                access: "public-read",
                width: 256,
                height: 256,
                url: "https://cdn.pixelbinx0.de/purple-river-400fad/original/1024x1024.png",
            },
            {
                _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
                createdAt: "2022-02-13T14:21:36.307Z",
                updatedAt: "2022-02-13T14:21:36.307Z",
                fileId: "1024x1024-kbsw-rPZk",
                path: "",
                name: "1024x1024-kbsw-rPZk",
                format: "png",
                type: "file",
                size: 26311,
                tags: [],
                metadata: [Object],
                access: "public-read",
                width: 256,
                height: 256,
                url: "https://cdn.pixelbinx0.de/purple-river-400fad/original/1024x1024-kbsw-rPZk.png",
            },
            {
                _id: "61eeaffc-289b-43e8-a983-b41edc4b6039",
                createdAt: "2022-02-14T08:08:05.396Z",
                updatedAt: "2022-02-14T08:08:05.396Z",
                fileId: "1_webp_a",
                path: "",
                name: "1_webp_a",
                format: "png",
                type: "file",
                size: 11732,
                tags: [],
                metadata: [Object],
                access: "public-read",
                width: 400,
                height: 301,
                url: "https://cdn.pixelbinx0.de/purple-river-400fad/original/1_webp_a.png",
            },
            {
                _id: "35d54221-fcdf-4683-bbd1-abb63f1c0a83",
                createdAt: "2022-02-14T08:08:05.595Z",
                updatedAt: "2022-02-14T08:08:05.595Z",
                fileId: "1_webp_a-(1)",
                path: "",
                name: "1_webp_a-(1)",
                format: "png",
                type: "file",
                size: 11732,
                tags: [],
                metadata: [Object],
                access: "public-read",
                width: 400,
                height: 301,
                url: "https://cdn.pixelbinx0.de/purple-river-400fad/original/1_webp_a-(1).png",
            },
            {
                _id: "033ae8e2-48c1-4b04-bac6-64c356b4be39",
                createdAt: "2022-02-14T10:53:21.056Z",
                updatedAt: "2022-02-14T10:53:21.056Z",
                fileId: "1_webp_a-(1)-573L-CEUT",
                path: "",
                name: "1_webp_a-(1)-573L-CEUT",
                format: "png",
                type: "file",
                size: 11732,
                tags: [],
                metadata: [Object],
                access: "public-read",
                width: 400,
                height: 301,
                url: "https://cdn.pixelbinx0.de/purple-river-400fad/original/1_webp_a-(1)-573L-CEUT.png",
            },
        ],
        page: { type: "number", size: 5, current: 1, hasNext: false, itemTotal: 5 },
    };

    it("should initialize and have assets and organization properties", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const pixelbin = new PixelbinClient(config);
        expect(pixelbin.config).toEqual(config);
        expect(pixelbin.assets).not.toBeUndefined();
        expect(pixelbin.organization).not.toBeUndefined();
    });
    it("should be able to explore assets correctly", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue(exploreResponse);

        const pixelbin = new PixelbinClient(config);
        const res = await pixelbin.assets.listFiles({
            onlyFiles: true,
            onlyFolders: false,
            pageNo: 1,
            pageSize: 5,
        });
        expect(res.items.length).toBe(5);
        expect(requestMock.mock.calls[0][0].headers["Authorization"]).toEqual(
            `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
        );
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/listFiles",
            params: {
                onlyFiles: true,
                onlyFolders: false,
                pageNo: 1,
                pageSize: 5,
                sort: undefined,
            },
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
        });
        requestMock.mockRestore();
    });
    it("should be able to paginate explore assets correctly", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue(exploreResponse);

        const pixelbin = new PixelbinClient(config);
        const exploreStoragePaginator = pixelbin.assets.listFilesPaginator({
            onlyFiles: true,
            onlyFolders: false,
            pageSize: 5,
        });
        const res = await exploreStoragePaginator.next();
        expect(res.items.length).toBe(5);
        expect(exploreStoragePaginator.hasNext()).toBe(false);
        expect(requestMock.mock.calls[0][0].headers["Authorization"]).toEqual(
            `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
        );
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/listFiles",
            params: {
                onlyFiles: true,
                onlyFolders: false,
                pageNo: 1,
                pageSize: 5,
                sort: undefined,
            },
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
        });
        requestMock.mockRestore();
    });
    it("should be able to use fileUpload successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue(exploreResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.fileUpload({
            file: fs.createReadStream("tests/fixtures/pluginResponse.js"),
        });
        expect(response.items.length).toBe(5);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "post",
            url: "/service/platform/assets/v1.0/upload/direct",
            params: {},
            data: expect.anything(),
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
                "content-type": expect.stringMatching(/^multipart\/form-data; boundary=.*/),
            },
        });
        expect(requestMock.mock.calls[0][0].data).toBeInstanceOf(FormData);
        requestMock.mockRestore();
    });
    it("should be able to use updateFile successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue(exploreResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.updateFile({
            fileId: "path/to/file",
            name: "New Name",
            path: "new/file/path",
            access: "private",
            isActive: false,
            tags: ["new tag"],
            metadata: {},
        });
        expect(response.items.length).toBe(5);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "patch",
            url: "/service/platform/assets/v1.0/files/path/to/file",
            params: {},
            data: expect.anything(),
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
        });
        expect(requestMock.mock.calls[0][0].data).toEqual({
            name: "New Name",
            path: "new/file/path",
            access: "private",
            isActive: false,
            tags: ["new tag"],
            metadata: {},
        });
        requestMock.mockRestore();
    });
});
