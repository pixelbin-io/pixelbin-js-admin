const { default: axios } = require("axios");
const FormData = require("form-data");
const stream = require("stream");
const asyncUtils = require("../utils/async");

/**
 * @ignore
 * @param {Buffer | stream.Readable} file
 * @param {Object} options
 * @param {Number} options.chunkSize
 * @param {Number} options.maxRetries
 * @param {Number} options.concurrency
 * @returns Promise
 */
async function multipartUploadToPixelBin(url, fields, file, options) {
    const { chunkSize, maxRetries, concurrency } = options;
    let partNumber = 0;
    let chunkBuffer = Buffer.alloc(0);

    /**
     * @ignore
     * @param {string} url
     * @param {Object} fields
     * @param {Buffer} chunk
     * @param {number} partNumber
     * @param {number} maxRetries
     * @returns {Promise<void>}
     */
    const uploadChunk = async (url, fields, chunk, partNumber, maxRetries) => {
        let retries = 0;

        const prepareChunk = () => {
            const form = new FormData();
            Object.entries(fields).forEach(([k, v]) => {
                form.append(k, v);
            });
            form.append("file", chunk, { filename: "file" });
            const urlObj = new URL(url);
            urlObj.searchParams.append("partNumber", partNumber);
            return { form, url: urlObj.toString() };
        };

        while (retries <= maxRetries) {
            try {
                let chunkData = prepareChunk();
                await axios.put(chunkData.url, chunkData.form, {
                    headers: {
                        ...chunkData.form.getHeaders(),
                    },
                    maxBodyLength: Infinity,
                });
                return;
            } catch (err) {
                retries++;
                if (retries > maxRetries) throw err;
            }
        }
    };

    /**
     * @ignore
     * @param {Buffer} chunk
     * @returns {Promise<void>}
     */
    const bufferChunkUpload = async (chunk) => {
        chunkBuffer = Buffer.concat([chunkBuffer, chunk]);

        while (chunkBuffer.length >= chunkSize * concurrency) {
            const partChunks = [];
            for (let i = 0; i < concurrency; i++) {
                const partBuffer = chunkBuffer.subarray(0, chunkSize);
                chunkBuffer = chunkBuffer.subarray(chunkSize);
                partNumber += 1;
                partChunks.push({
                    chunk: partBuffer,
                    partNumber,
                });
            }

            await asyncUtils.eachLimit(partChunks, concurrency, async (chunk) => {
                return uploadChunk(url, fields, chunk.chunk, chunk.partNumber, maxRetries);
            });
        }
    };

    if (Buffer.isBuffer(file)) {
        await bufferChunkUpload(file);
    } else if (file instanceof stream.Readable) {
        for await (const chunk of file) {
            await bufferChunkUpload(chunk);
        }
    } else {
        throw new Error("Unsupported file type. Expected Buffer or Readable stream.");
    }

    // Upload any remaining data
    if (chunkBuffer.length > 0) {
        const fileChunks = [];
        for (let i = 0; i < chunkBuffer.length; i += chunkSize) {
            const partBuffer = chunkBuffer.subarray(i, i + chunkSize);
            partNumber += 1;
            fileChunks.push({
                chunk: partBuffer,
                partNumber,
            });
        }
        await asyncUtils.eachLimit(fileChunks, concurrency, async (chunk) => {
            return uploadChunk(url, fields, chunk.chunk, chunk.partNumber, maxRetries);
        });
    }

    const completeMultipartUpload = async (url, fields) => {
        const urlObj = new URL(url);

        const res = await axios.post(urlObj.toString(), {
            parts: Array.from({ length: partNumber }, (_, i) => i + 1),
            ...fields,
        });

        return res.data;
    };

    return completeMultipartUpload(url, fields);
}

/**
 * Upload files to PixelBin
 * @class Uploader
 * @typedef {Uploader}
 */
class Uploader {
    constructor(assets) {
        this.assets = assets;
    }

    /**
     * Upload a file to PixelBin
     *
     * @param {Object} arg - The upload arguments
     * @param {Buffer | stream.Readable } arg.file - The file to be uploaded.
     * @param {string} arg.name name of the file
     * @param {string} arg.path Path of containing folder.
     * @param {string} arg.format Format of the file
     * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
     * @param {[string]} arg.tags Tags associated with the file.
     * @param {object} arg.metadata Metadata associated with the file.
     * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
     * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
     * @param {Object} arg.options - extra options if available
     * @param {Object} arg.uploadOptions - The upload options.
     * @param {Number} [arg.uploadOptions.chunkSize=10485760] - The chunk size in bytes. Default is 10MB.
     * @param {Number} [arg.uploadOptions.maxRetries=2] - The maximum number of retries. Default is 2.
     * @param {Number} [arg.uploadOptions.concurrency=3] - The number of concurrent uploads. Default is 3.
     * @returns {Promise<Object>} - Returns the file metadata
     */
    async upload({
        file,
        name,
        path,
        format,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
        expiry,
        options,
        uploadOptions = {},
    }) {
        if (!uploadOptions.chunkSize) uploadOptions.chunkSize = 10 * 1024 * 1024; // 10MB
        if (uploadOptions.maxRetries == undefined) uploadOptions.maxRetries = 2;
        if (!uploadOptions.concurrency) uploadOptions.concurrency = 3;

        const { presignedUrl } = await this.assets.createSignedUrlV2({
            name,
            path,
            format,
            access,
            tags,
            metadata,
            overwrite,
            filenameOverride,
            expiry,
            options,
        });

        const { url, fields } = presignedUrl;
        return await multipartUploadToPixelBin(url, fields, file, uploadOptions);
    }
}

module.exports = {
    Uploader,
};
