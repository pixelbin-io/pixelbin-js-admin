const FormData = require("form-data");
const stream = require("stream");
const asyncUtils = require("../utils/async");
const retry = require("async-retry");
const { PDKIllegalArgumentError, PDKServerResponseError } = require("../common/PDKError");
const { uploaderAxios } = require("../common/AxiosHelper");

/**
 * @ignore
 * @param {Object} args
 * @param {string} args.url
 * @param {Object} args.fields
 * @param {Buffer} args.chunk
 * @param {number} args.partNumber
 * @param {number} args.maxRetries
 * @param {number} args.exponentialFactor
 * @returns {Promise<void>}
 */
const uploadChunk = async ({ url, fields, chunk, partNumber, maxRetries, exponentialFactor }) => {
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

    let chunkData = prepareChunk();

    await retry(
        async (bail) => {
            try {
                await uploaderAxios.put(chunkData.url, chunkData.form, {
                    headers: {
                        ...chunkData.form.getHeaders(),
                    },
                    maxBodyLength: Infinity,
                });
            } catch (err) {
                if (
                    err instanceof PDKServerResponseError &&
                    err.code &&
                    err.code >= 400 &&
                    err.code < 500
                ) {
                    bail(err);
                } else {
                    throw err;
                }
            }
        },
        {
            retries: maxRetries,
            factor: exponentialFactor,
        },
    );
};

/**
 * @ignore
 * @param {Buffer} chunkBuffer
 * @param {Object} rc requestContext
 * @param {number} rc.chunkSize
 * @param {number} rc.concurrency
 * @param {string} rc.url
 * @param {Object} rc.fields
 * @param {number} rc.partNumber
 * @param {number} rc.maxRetries
 * @param {number} rc.exponentialFactor
 * @returns {Promise<Buffer>} returns the modified buffer
 */
const bufferChunkUpload = async (chunkBuffer, rc) => {
    while (chunkBuffer.length >= rc.chunkSize * rc.concurrency) {
        const partChunks = [];
        for (let i = 0; i < rc.concurrency; i++) {
            const partBuffer = chunkBuffer.subarray(0, rc.chunkSize);
            chunkBuffer = chunkBuffer.subarray(rc.chunkSize);
            rc.partNumber += 1;
            partChunks.push({
                chunk: partBuffer,
                partNumber: rc.partNumber,
            });
        }

        await asyncUtils.eachLimit(partChunks, rc.concurrency, async (chunk) => {
            return uploadChunk({
                url: rc.url,
                fields: rc.fields,
                chunk: chunk.chunk,
                partNumber: chunk.partNumber,
                maxRetries: rc.maxRetries,
                exponentialFactor: rc.exponentialFactor,
            });
        });
    }
    return chunkBuffer;
};

/**
 * @ignore
 * @async
 * @param {Object} args
 * @param {string} args.url
 * @param {Object} args.fields
 * @param {number} args.partNumber
 * @param {number} args.maxRetries
 * @param {number} args.exponentialFactor
 * @returns {Promise<Object>}
 */
const completeMultipartUpload = async ({
    url,
    fields,
    partNumber,
    maxRetries,
    exponentialFactor,
}) => {
    const urlObj = new URL(url);

    return await retry(
        async (bail) => {
            try {
                const res = await uploaderAxios.post(urlObj.toString(), {
                    parts: Array.from({ length: partNumber }, (_, i) => i + 1),
                    ...fields,
                });
                return res;
            } catch (err) {
                if (
                    err instanceof PDKServerResponseError &&
                    err.code &&
                    err.code >= 400 &&
                    err.code < 500
                ) {
                    bail(err);
                } else {
                    throw err;
                }
            }
        },
        {
            retries: maxRetries,
            factor: exponentialFactor,
        },
    );
};

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
    const { chunkSize, maxRetries, concurrency, exponentialFactor } = options;
    let chunkBuffer = Buffer.alloc(0);

    const requestContext = {
        url,
        fields,
        chunkSize,
        maxRetries,
        concurrency,
        exponentialFactor,
        partNumber: 0,
    };

    if (Buffer.isBuffer(file)) {
        chunkBuffer = file;
        chunkBuffer = await bufferChunkUpload(chunkBuffer, requestContext);
    } else if (file instanceof stream.Readable) {
        for await (const chunk of file) {
            chunkBuffer = Buffer.concat([chunkBuffer, chunk]);
            chunkBuffer = await bufferChunkUpload(chunkBuffer, requestContext);
        }
    } else {
        throw new PDKIllegalArgumentError(
            "Unsupported file type. Expected Buffer or Readable stream.",
        );
    }

    // Upload any remaining data
    if (chunkBuffer.length > 0) {
        const fileChunks = [];
        for (let i = 0; i < chunkBuffer.length; i += chunkSize) {
            const partBuffer = chunkBuffer.subarray(i, i + chunkSize);
            requestContext.partNumber += 1;
            fileChunks.push({
                chunk: partBuffer,
                partNumber: requestContext.partNumber,
            });
        }
        await asyncUtils.eachLimit(fileChunks, concurrency, async (chunk) => {
            return uploadChunk({
                url,
                fields,
                chunk: chunk.chunk,
                partNumber: chunk.partNumber,
                maxRetries,
                exponentialFactor,
            });
        });
    }

    return completeMultipartUpload(requestContext);
}

/**
 * Upload files to PixelBin
 * @class Uploader
 * @typedef {Uploader}
 */
class Uploader {
    #assets;

    constructor(assets) {
        this.#assets = assets;
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
     * @param {Number} [arg.uploadOptions.exponentialFactor=2] - The exponential factor for retry delay. Default is 2.
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
        if (uploadOptions.chunkSize == undefined || uploadOptions.chunkSize == null) {
            uploadOptions.chunkSize = 10 * 1024 * 1024; // 10MB default
        } else if (!Number.isInteger(uploadOptions.chunkSize) || uploadOptions.chunkSize <= 0) {
            throw new PDKIllegalArgumentError("Invalid chunkSize: Must be a positive integer");
        }

        if (uploadOptions.maxRetries == undefined || uploadOptions.maxRetries == null) {
            uploadOptions.maxRetries = 2; // Default to 2 retries
        } else if (!Number.isInteger(uploadOptions.maxRetries) || uploadOptions.maxRetries < 0) {
            throw new PDKIllegalArgumentError("Invalid maxRetries: Must be a non-negative integer");
        }

        if (uploadOptions.concurrency == undefined || uploadOptions.concurrency == null) {
            uploadOptions.concurrency = 3; // Default to 3 concurrent uploads
        } else if (!Number.isInteger(uploadOptions.concurrency) || uploadOptions.concurrency <= 0) {
            throw new PDKIllegalArgumentError("Invalid concurrency: Must be a positive integer");
        }

        if (
            uploadOptions.exponentialFactor == undefined ||
            uploadOptions.exponentialFactor == null
        ) {
            uploadOptions.exponentialFactor = 2; // Default to an exponential factor of 2
        } else if (
            typeof uploadOptions.exponentialFactor !== "number" ||
            uploadOptions.exponentialFactor < 0
        ) {
            throw new PDKIllegalArgumentError(
                "Invalid exponentialFactor: Must be a non-negative number",
            );
        }

        const { presignedUrl } = await this.#assets.createSignedUrlV2({
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
