const FileType = require("file-type");
const path = require("path");
/**
 * Some Content-Types are incorrectly detected by the core libraries we use.
 * This function returns the correct types considering the file extension.
 * @param {String} contentType
 * @param {String} ext
 * @returns {{mime:String, ext: String]} Correct FileType object
 */

const getCorrectFileType = (fileType, fileExt) => {
    const { mime: derivedContentType, ext: derivedExt } = fileType;

    let correctType = derivedContentType,
        correctExt = derivedExt;
    if (derivedContentType === "application/zip" && fileExt === "apk") {
        correctType = getContentTypeFromFormat(fileExt);
        correctExt = fileExt;
    } else if (derivedContentType === "image/heif" && fileExt === "avif") {
        correctType = "image/avif";
        correctExt = fileExt;
    } else if (derivedContentType === "image/heic" && fileExt === "heif") {
        correctType = "image/heif";
        correctExt = fileExt;
    } else if (derivedContentType === "application/xml" && fileExt === "svg") {
        correctType = "image/svg+xml";
        correctExt = fileExt;
    } else if (derivedContentType === "image/x-icon" && fileExt === "dfont") {
        correctType = "application/x-dfont";
        correctExt = fileExt;
    } else if (derivedContentType === "audio/x-ms-asf" && derivedExt === "asf") {
        correctExt = fileExt;
    } else if (derivedContentType === "application/octet-stream" && fileExt !== "bin") {
        correctExt = fileExt;
    }

    correctType = MIME_TYPE_LOOKUP[correctType] || correctType;
    return { mime: correctType, ext: correctExt };
};

const getExtensionFromAssetPath = (assetPath) => {
    if (!assetPath) return null;

    let { ext } = path.parse(assetPath);
    let extension = ext.replace(".", "");
    return extension.length ? extension : null;
};

/**
 * Returns the MIME type for the buffer. Uses `filename` in
 * the `opts` param as a fallback, if buffer in un-decipherable.
 * @param {Buffer} buffer
 * @param {{filename: String}} opts
 * @returns The detected file type and MIME type, or undefined when there is no match.
 */
exports.fileTypeFromBuffer = async (buffer, opts = {}) => {
    let fileType = await FileType.fromBuffer(buffer);
    if (!fileType) return { mime: opts.contentType };

    const fileExt = getExtensionFromAssetPath(opts.filename);
    return getCorrectFileType(fileType, fileExt);
};
