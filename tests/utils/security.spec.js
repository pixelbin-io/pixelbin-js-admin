const { PDKIllegalArgumentError } = require("../../sdk/common/PDKError");
const { signURL } = require("../../sdk/utils/security");

describe("Signed URL", () => {
    it("should sign URL", () => {
        const signedURL = signURL(
            "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
            20,
            "459337ed-f378-4ddf-bad7-d7a4555c4572",
            "dummy-token",
        );
        const signedURLObj = new URL(signedURL);
        expect(signedURLObj.searchParams.has("pbs")).toBeTruthy();
        expect(signedURLObj.searchParams.has("pbe")).toBeTruthy();
        expect(signedURLObj.searchParams.has("pbt")).toBeTruthy();
    });

    it("should sign URL - custom domain", () => {
        const signedURL = signURL(
            "https://krit.imagebin.io/v2/original/__playground/playground-default.jpeg",
            20,
            "08040485-dc83-450b-9e1f-f1040044ae3f",
            "dummy-token-2",
        );
        const signedURLObj = new URL(signedURL);
        expect(signedURLObj.searchParams.has("pbs")).toBeTruthy();
        expect(signedURLObj.searchParams.has("pbe")).toBeTruthy();
        expect(signedURLObj.searchParams.has("pbt")).toBeTruthy();
    });

    it("should throw error when url is not provided", () => {
        expect(() => {
            signURL(null, 20, 1, "dummy-token");
        }).toThrow(PDKIllegalArgumentError);
    });

    it("should throw error when accessKey is not provided", () => {
        expect(() => {
            signURL(
                "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
                20,
                null,
                "dummy-token",
            );
        }).toThrow(PDKIllegalArgumentError);
    });

    it("should throw error when token is not provided", () => {
        expect(() => {
            signURL(
                "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
                20,
                1,
                null,
            );
        }).toThrow(PDKIllegalArgumentError);
    });

    it("should throw error when expirySeconds is not provided", () => {
        expect(() => {
            signURL(
                "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
                null,
                1,
                "dummy-token",
            );
        }).toThrow(PDKIllegalArgumentError);
    });
});
