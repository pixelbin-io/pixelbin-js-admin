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
            tags: ["cats", "dogs"],
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
                "tags[0]": "cats",
                "tags[1]": "dogs",
            },
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
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
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });
    it("should be able to use fileUpload successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const appendSpy = jest.spyOn(FormData.prototype, "append");

        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue(exploreResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.fileUpload({
            file: fs.createReadStream("tests/fixtures/pluginResponse.js"),
            overwrite: true,
            tags: ["tag1", "tag2"],
            options: {
                contentType: "image/jpeg",
                filename: "test",
            },
        });
        expect(appendSpy.mock.calls).toContainEqual(["tags", "tag1"]);
        expect(appendSpy.mock.calls).toContainEqual(["tags", "tag2"]);
        expect(appendSpy.mock.calls).toContainEqual(["overwrite", "true"]);
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
            maxBodyLength: Infinity,
        });
        expect(requestMock.mock.calls[0][0].data).toBeInstanceOf(FormData);
        requestMock.mockRestore();
        appendSpy.mockRestore();
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
            maxBodyLength: Infinity,
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
    it("should be able to use getFolderDetails successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue([
            {
                _id: "dummy-uuid",
                createdAt: "2022-10-05T10:43:04.117Z",
                updatedAt: "2022-10-05T10:43:04.117Z",
                name: "asset2",
                type: "file",
                path: "dir",
                fileId: "dir/asset2",
                format: "jpeg",
                size: 1000,
                access: "private",
                metadata: {},
                height: 100,
                width: 100,
            },
        ]);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.getFolderDetails({
            path: "dir1/dir2",
            name: "dir",
        });

        expect(response.length).toBe(1);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/folders",
            params: {
                path: "dir1/dir2",
                name: "dir",
            },
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });
    it("should be able to use getFolderAncestors successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        requestMock.mockResolvedValue({
            folder: {
                _id: "dummy-uuid",
                name: "subDir",
                path: "dir1/dir2",
                isActive: true,
            },
            ancestors: [
                {
                    _id: "dummy-uuid-2",
                    name: "dir1",
                    path: "",
                    isActive: true,
                },
                {
                    _id: "dummy-uuid-2",
                    name: "dir2",
                    path: "dir1",
                    isActive: true,
                },
            ],
        });

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.getFolderAncestors({
            _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
        });

        expect(response.ancestors.length).toBe(2);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/folders/c9138153-94ea-4dbe-bea9-65d43dba85ae/ancestors",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use addCredentials successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const addCredentialsResponse = {
            _id: "123ee789-7ae8-4336-b9bd-e4f33c049002",
            createdAt: "2022-10-04T09:52:09.545Z",
            updatedAt: "2022-10-04T09:52:09.545Z",
            orgId: 23,
            pluginId: "awsRek",
        };
        requestMock.mockResolvedValue(addCredentialsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.addCredentials({
            credentials: {
                region: "ap-south-1",
                accessKeyId: "123456789ABC",
                secretAccessKey: "DUMMY1234567890",
            },
            pluginId: "awsRek",
        });

        expect(response).toBe(addCredentialsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "post",
            url: "/service/platform/assets/v1.0/credentials",
            params: {},
            data: {
                credentials: {
                    region: "ap-south-1",
                    accessKeyId: "123456789ABC",
                    secretAccessKey: "DUMMY1234567890",
                },
                pluginId: "awsRek",
            },
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use updateCredentials successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const updateCredentialsResponse = {
            _id: "123ee789-7ae8-4336-b9bd-e4f33c049002",
            createdAt: "2022-10-04T09:52:09.545Z",
            updatedAt: "2022-10-04T09:52:09.545Z",
            orgId: 23,
            pluginId: "awsRek",
        };
        requestMock.mockResolvedValue(updateCredentialsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.updateCredentials({
            pluginId: "awsRek",
            credentials: {
                region: "ap-south-1",
                accessKeyId: "123456789ABC",
                secretAccessKey: "DUMMY1234567890",
            },
        });

        expect(response).toBe(updateCredentialsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "patch",
            url: "/service/platform/assets/v1.0/credentials/awsRek",
            params: {},
            data: {
                credentials: {
                    region: "ap-south-1",
                    accessKeyId: "123456789ABC",
                    secretAccessKey: "DUMMY1234567890",
                },
            },
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use deleteCredentials successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const deleteCredentialsResponse = {
            _id: "123ee789-7ae8-4336-b9bd-e4f33c049002",
            createdAt: "2022-10-04T09:52:09.545Z",
            updatedAt: "2022-10-04T09:52:09.545Z",
            orgId: 23,
            pluginId: "awsRek",
        };
        requestMock.mockResolvedValue(deleteCredentialsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.deleteCredentials({
            pluginId: "awsRek",
        });

        expect(response).toBe(deleteCredentialsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "delete",
            url: "/service/platform/assets/v1.0/credentials/awsRek",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use addPreset successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const addPresetResponse = {
            presetName: "p1",
            transformation: "t.flip()~t.flop()",
            params: {
                w: {
                    type: "integer",
                    default: 200,
                },
                h: {
                    type: "integer",
                    default: 400,
                },
            },
            archived: false,
        };
        requestMock.mockResolvedValue(addPresetResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.addPreset({
            presetName: "p1",
            transformation: "t.flip()~t.flop()",
            params: { w: { type: "integer", default: 200 }, h: { type: "integer", default: 400 } },
        });

        expect(response).toBe(addPresetResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "post",
            url: "/service/platform/assets/v1.0/presets",
            params: {},
            data: {
                presetName: "p1",
                transformation: "t.flip()~t.flop()",
                params: {
                    w: {
                        type: "integer",
                        default: 200,
                    },
                    h: {
                        type: "integer",
                        default: 400,
                    },
                },
            },
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use getPresets successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const getPresetsResponse = {
            items: [
                {
                    presetName: "p1",
                    transformation: "t.flip()~t.flop()",
                    params: {
                        w: {
                            type: "integer",
                            default: 200,
                        },
                        h: {
                            type: "integer",
                            default: 400,
                        },
                    },
                    archived: true,
                },
            ],
            page: {
                type: "number",
                size: 1,
                current: 1,
                hasNext: false,
            },
        };
        requestMock.mockResolvedValue(getPresetsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.getPresets();

        expect(response).toBe(getPresetsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/presets",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });
    it("should be able to use updatePresets successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const updatePresetsResponse = {
            presetName: "p1",
            transformation: "t.flip()~t.flop()",
            params: {
                w: {
                    type: "integer",
                    default: 200,
                },
                h: {
                    type: "integer",
                    default: 400,
                },
            },
            archived: true,
        };
        requestMock.mockResolvedValue(updatePresetsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.updatePreset({
            presetName: "p1",
            archived: true,
        });

        expect(response).toBe(updatePresetsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "patch",
            url: "/service/platform/assets/v1.0/presets/p1",
            params: {},
            data: { archived: true },
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use deletePreset successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const deletePresetsResponse = {
            presetName: "p1",
            transformation: "t.flip()~t.flop()",
            params: {
                w: {
                    type: "integer",
                    default: 200,
                },
                h: {
                    type: "integer",
                    default: 400,
                },
            },
            archived: true,
        };
        requestMock.mockResolvedValue(deletePresetsResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.deletePreset({
            presetName: "p1",
        });

        expect(response).toBe(deletePresetsResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "delete",
            url: "/service/platform/assets/v1.0/presets/p1",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use getPreset successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const getPresetResponse = {
            presetName: "p1",
            transformation: "t.flip()~t.flop()",
            params: {
                w: {
                    type: "integer",
                    default: 200,
                },
                h: {
                    type: "integer",
                    default: 400,
                },
            },
            archived: true,
        };
        requestMock.mockResolvedValue(getPresetResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.getPreset({ presetName: "p1" });

        expect(response).toBe(getPresetResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/presets/p1",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use getDefaultAssetForPlayground successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const getDefaultAssetForPlaygroundResponse = {
            _id: "dummy-uuid",
            name: "asset",
            path: "dir",
            fileId: "dir/asset",
            format: "jpeg",
            size: 1000,
            access: "private",
            isActive: true,
            tags: ["tag1", "tag2"],
            metadata: {
                key: "value",
            },
            url: "https://domain.com/filename.jpeg",
        };
        requestMock.mockResolvedValue(getDefaultAssetForPlaygroundResponse);

        const pixelbin = new PixelbinClient(config);
        const response = await pixelbin.assets.getDefaultAssetForPlayground();
        expect(response).toBe(getDefaultAssetForPlaygroundResponse);
        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/assets/v1.0/playground/default",
            params: {},
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });

    it("should be able to use getTransformationContext successfully", async () => {
        const config = new PixelbinConfig({
            domain: "https://api.testdomain.com",
            apiSecret: "test-api-secret",
        });
        const requestMock = jest.spyOn(pdkAxios, "request");
        const getTransformationContextResponse = {
            context: {
                steps: expect.anything(),
                metadata: {
                    width: 1140,
                    height: 760,
                    channels: 3,
                    extension: "jpeg",
                    format: "jpeg",
                    contentType: "image/jpeg",
                    size: 218409,
                    assetType: "image",
                    isImageAsset: true,
                    isAudioAsset: false,
                    isVideoAsset: false,
                    isRawAsset: false,
                    isTransformationSupported: true,
                },
                headers: {
                    host: "api.pixelbin.io",
                    accept: "application/json, text/plain, */*",
                },
                params: {},
            },
        };
        requestMock.mockResolvedValue(getTransformationContextResponse);

        const pixelbin = new PixelbinClient(config);

        const response = await pixelbin.transformation.getTransformationContext({
            url: "/v2/fynd-eg/t.resize()/__playground/playground-default.jpeg",
        });

        expect(response).toBe(getTransformationContextResponse);

        expect(requestMock.mock.calls[0][0]).toEqual({
            baseURL: config.domain,
            method: "get",
            url: "/service/platform/transformation/context",
            params: {
                url: "/v2/fynd-eg/t.resize()/__playground/playground-default.jpeg",
            },
            data: undefined,
            headers: {
                Authorization: `Bearer ${Buffer.from("test-api-secret").toString("base64")}`,
            },
            maxBodyLength: Infinity,
        });
        requestMock.mockRestore();
    });
});
