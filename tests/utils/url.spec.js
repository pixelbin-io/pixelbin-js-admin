const { url } = require("../../");
const { PDKIllegalArgumentError } = require("../../sdk/common/PDKError");

describe("URL", () => {
    it("should get obj from url", async () => {
        const obj = url.urlToObj(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/t.resize()/__playground/playground-default.jpeg",
        );
        expect(obj.transformations).toEqual([
            {
                plugin: "t",
                name: "resize",
            },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBeUndefined();
        expect(obj.baseUrl).toBe("https://cdn.pixelbin.io");
        expect(obj.pattern).toBe("t.resize()");
        expect(obj.version).toBe("v2");
        expect(obj.filePath).toBe("__playground/playground-default.jpeg");
    });
    it("should get obj from url no version", async () => {
        const obj = url.urlToObj(
            "https://cdn.pixelbin.io/red-scene-95b6ea/t.resize()/__playground/playground-default.jpeg",
        );
        expect(obj.transformations).toEqual([
            {
                plugin: "t",
                name: "resize",
            },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBeUndefined();
        expect(obj.baseUrl).toBe("https://cdn.pixelbin.io");
        expect(obj.pattern).toBe("t.resize()");
        expect(obj.version).toBe("v1");
        expect(obj.filePath).toBe("__playground/playground-default.jpeg");
    });
    it("should get obj from url with zoneslug ", async () => {
        const obj = url.urlToObj(
            "https://cdn.pixelbinx0.de/red-scene-95b6ea/zonesl/t.resize()/__playground/playground-default.jpeg",
        );
        expect(obj.transformations).toEqual([
            {
                plugin: "t",
                name: "resize",
            },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBe("zonesl");
        expect(obj.baseUrl).toBe("https://cdn.pixelbinx0.de");
        expect(obj.pattern).toBe("t.resize()");
        expect(obj.version).toBe("v1");
        expect(obj.filePath).toBe("__playground/playground-default.jpeg");
    });
    it("should get obj from url - 1", async () => {
        const obj = url.urlToObj(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/t.resize(h:200,w:100)/__playground/playground-default.jpeg",
        );
        expect(obj.transformations).toEqual([
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "h",
                        value: "200",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                ],
            },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBeUndefined();
        expect(obj.baseUrl).toBe("https://cdn.pixelbin.io");
        expect(obj.pattern).toBe("t.resize(h:200,w:100)");
        expect(obj.filePath).toBe("__playground/playground-default.jpeg");
    });
    it("should get obj from url - 2", async () => {
        const obj = url.urlToObj(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()/__playground/playground-default.jpeg",
        );
        expect(obj.transformations).toEqual([
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "h",
                        value: "200",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                    {
                        key: "fill",
                        value: "999",
                    },
                ],
            },
            {
                plugin: "erase",
                name: "bg",
            },
            {
                plugin: "t",
                name: "extend",
            },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBeUndefined();
        expect(obj.baseUrl).toBe("https://cdn.pixelbin.io");
        expect(obj.pattern).toBe("t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()");
        expect(obj.filePath).toBe("__playground/playground-default.jpeg");
    });
    it("should get obj from url with preset", async () => {
        const presetUrl =
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/t.compress()~t.resize()~t.extend()~p.apply(n:presetNameXyx)/alien_fig_tree_planet_x_wallingford_seattle_washington_usa_517559.jpeg";
        const obj = url.urlToObj(presetUrl);
        expect(obj.transformations).toEqual([
            { name: "compress", plugin: "t" },
            { name: "resize", plugin: "t" },
            { name: "extend", plugin: "t" },
            { plugin: "p", name: "presetNameXyx" },
        ]);
        expect(obj.cloudName).toBe("red-scene-95b6ea");
        expect(obj.zone).toBeUndefined();
        expect(obj.baseUrl).toBe("https://cdn.pixelbin.io");
        expect(obj.pattern).toBe("t.compress()~t.resize()~t.extend()~p.apply(n:presetNameXyx)");
        expect(obj.filePath).toBe(
            "alien_fig_tree_planet_x_wallingford_seattle_washington_usa_517559.jpeg",
        );
    });
    it("should get obj from url with preset", async () => {
        const presetUrl =
            "https://cdn.pixelbin.io/v3/red-scene-95b6ea/t.compress()~t.resize()~t.extend()~p.apply(n:presetNameXyx)/alien_fig_tree_planet_x_wallingford_seattle_washington_usa_517559.jpeg";
        expect(() => url.urlToObj(presetUrl)).toThrow(
            "Invalid pixelbin url. Please make sure the url is correct.",
        );
    });
    it("should handle incorrect urls - incorrect zone", async () => {
        const presetUrl =
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/test/t.compress()~t.resize()~t.extend()~p.apply(n:presetNameXyx)/alien_fig_tree_planet_x_wallingford_seattle_washington_usa_517559.jpeg";
        expect(() => url.urlToObj(presetUrl)).toThrow("Error Processing url");
    });

    it("should handle incorrect urls - incorrect pattern", async () => {
        const presetUrl =
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/t.compress~t.resize()~t.extend()~p.apply(n:presetNameXyx)/alien_fig_tree_planet_x_wallingford_seattle_washington_usa_517559.jpeg";
        expect(() => url.urlToObj(presetUrl)).toThrow("Error Processing url");
    });
    it("should generate url from obj", async () => {
        const transformations = [
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "h",
                        value: "200",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                    {
                        key: "fill",
                        value: "999",
                    },
                ],
            },
            {
                plugin: "erase",
                name: "bg",
            },
            {
                plugin: "t",
                name: "extend",
            },
            {
                plugin: "p",
                name: "preset1",
            },
        ];
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: transformations,
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1/__playground/playground-default.jpeg",
        );
    });
    it("should generate url from obj - 1", async () => {
        const transformations = [
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "h",
                        value: "200",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                    {
                        key: "fill",
                        value: "999",
                    },
                ],
            },
            {
                plugin: "erase",
                name: "bg",
                values: [
                    {
                        key: "i",
                        value: "general",
                    },
                ],
            },
            {
                plugin: "t",
                name: "extend",
            },
            {
                plugin: "p",
                name: "preset1",
            },
        ];
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: transformations,
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/t.resize(h:200,w:100,fill:999)~erase.bg(i:general)~t.extend()~p:preset1/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/t.resize(h:200,w:100,fill:999)~erase.bg(i:general)~t.extend()~p:preset1/__playground/playground-default.jpeg",
        );
    });
    it("should throw error if transformation object is incorrect", async () => {
        const transformations = [
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                    {
                        key: "fill",
                        value: "999",
                    },
                ],
            },
            {
                plugin: "erase",
                name: "bg",
                values: [
                    {
                        key: "i",
                        value: "general",
                    },
                ],
            },
            {
                plugin: "t",
                name: "extend",
            },
            {
                plugin: "p",
                name: "preset1",
            },
        ];
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: transformations,
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        expect(() => url.objToUrl(obj)).toThrow("key not specified");
        obj.version = "v1";
        expect(() => url.objToUrl(obj)).toThrow("key not specified");
    });
    it("should throw error if transformation object is incorrect", async () => {
        const transformations = [
            {
                plugin: "t",
                name: "resize",
                values: [
                    {
                        key: "h",
                    },
                    {
                        key: "w",
                        value: "100",
                    },
                    {
                        key: "fill",
                        value: "999",
                    },
                ],
            },
            {
                plugin: "erase",
                name: "bg",
                values: [
                    {
                        key: "i",
                        value: "general",
                    },
                ],
            },
            {
                plugin: "t",
                name: "extend",
            },
            {
                plugin: "p",
                name: "preset1",
            },
        ];
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: transformations,
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        expect(() => url.objToUrl(obj)).toThrow("value not specified for key h");
        obj.version = "v1";
        expect(() => url.objToUrl(obj)).toThrow("value not specified for key h");
    });
    it("should generate url from obj when empty", async () => {
        const transformations = [];
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: transformations,
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        // expect(urlUtils.generatePixelbinPattern(transformation)).toBe("t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1");
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
    });
    it("should generate url from obj undefined", async () => {
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        // expect(urlUtils.generatePixelbinPattern(transformation)).toBe("t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1");
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
    });
    it("should generate url from obj  empty object", async () => {
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: [{}],
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        // expect(urlUtils.generatePixelbinPattern(transformation)).toBe("t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1");
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
    });
    it("should generate url from obj  empty object", async () => {
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: [{}],
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "__playground/playground-default.jpeg",
        };
        let generatedUrl = url.objToUrl(obj);
        // expect(urlUtils.generatePixelbinPattern(transformation)).toBe("t.resize(h:200,w:100,fill:999)~erase.bg()~t.extend()~p:preset1");
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v2/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
        obj.version = "v1";
        generatedUrl = url.objToUrl(obj);
        expect(generatedUrl).toBe(
            "https://cdn.pixelbin.io/v1/red-scene-95b6ea/z-slug/original/__playground/playground-default.jpeg",
        );
    });
    it("should throw error to generate url from obj if filePath not defined", async () => {
        const obj = {
            cloudName: "red-scene-95b6ea",
            zone: "z-slug",
            version: "v2",
            transformations: [{}],
            baseUrl: "https://cdn.pixelbin.io",
            filePath: "",
        };
        expect(() => url.objToUrl(obj)).toThrow(PDKIllegalArgumentError);
    });
});
