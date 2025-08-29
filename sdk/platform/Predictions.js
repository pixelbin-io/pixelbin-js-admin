const FormData = require("form-data");
const retry = require("async-retry");
const PlatformAPIClient = require("./PlatformAPIClient");
const { PDKClientValidationError } = require("../common/PDKError");
const path = require("path");

class Predictions {
  constructor(config) {
    this.config = config;
  }

  /**
   * Create prediction using name (plugin_operation)
   * @param {Object} arg - arg object.
   * @param {string} arg.name - Name identifier in format "plugin_operation" (e.g. "erase_bg")
   * @param {Object} [arg.input] - Form fields; e.g. { image: ReadableStream | Buffer | string }
   * @returns {Promise<Object>} - job initiation response
   */
  create({ name, input = {}, webhook } = {}) {
    if (!name || typeof name !== "string") {
      return Promise.reject(
        new PDKClientValidationError({
          details: [{ message: "name (string) is required" }],
        }),
      );
    }

    const parts = name.split("_");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return Promise.reject(
        new PDKClientValidationError({
          details: [
            {
              message:
                "name must be in 'plugin_operation' format, e.g. 'erase_bg'",
            },
          ],
        }),
      );
    }
    const plugin = parts[0];
    const operation = parts[1];

    const query_params = {};
    const body = new FormData();

    const isStream = (v) => v && typeof v.pipe === "function";
    const isBuffer = (v) => Buffer.isBuffer(v);
    const inferFilename = (v, key) => {
      const p = v && v.path;
      if (p && typeof p === "string") return path.basename(p);
      if (p && Buffer.isBuffer(p)) return path.basename(p.toString());
      return `${key}.jpeg`;
    };

    if (webhook) {
      body.append("webhook", webhook);
    }

    Object.entries(input || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const fieldName = `input.${key}`;

      const appendValue = (val) => {
        if (
          val &&
          typeof val === "object" &&
          !isBuffer(val) &&
          val.value !== undefined
        ) {
          const filename = val.filename;
          body.append(
            fieldName,
            val.value,
            filename ? { filename } : undefined,
          );
          return;
        }

        // New: raw Buffer or Stream => add filename
        if (isBuffer(val) || isStream(val)) {
          const filename = inferFilename(val, key);
          body.append(fieldName, val, { filename });
          return;
        }

        // Objects (non-file) => JSON
        if (typeof val === "object" && !isBuffer(val)) {
          body.append(fieldName, JSON.stringify(val));
          return;
        }

        // Primitives (string/number/bool) => as-is
        body.append(fieldName, val);
      };

      if (Array.isArray(value)) {
        value.forEach((v) => appendValue(v));
      } else {
        appendValue(value);
      }
    });

    return PlatformAPIClient.execute(
      this.config,
      "post",
      `/service/platform/transformation/v1.0/predictions/${plugin}/${operation}`,
      query_params,
      body,
      "multipart/form-data",
    );
  }

  /**
   * Get prediction details by requestId (job._id)
   * @param {string} requestId - Request ID (e.g. "erase--bg--0198a23e")
   * @returns {Promise<Object>} - job status/response
   */
  get(requestId) {
    if (!requestId || typeof requestId !== "string") {
      return Promise.reject(
        new PDKClientValidationError({
          details: [{ message: "requestId (string) is required" }],
        }),
      );
    }
    const path = `/service/platform/transformation/v1.0/predictions/${requestId}`;
    const query_params = {};
    return PlatformAPIClient.execute(
      this.config,
      "get",
      path,
      query_params,
      undefined,
    );
  }

  /**
   * Wait for prediction to complete (SUCCESS/FAILURE) with retry options
   * Defaults: maxAttempts 150, retryFactor 1, retryInterval 4000ms
   * @param {string} requestId
   * @param {Object} [options]
   * @param {number} [options.maxAttempts] - Maximum number of polling attempts (maps to retries)
   * @param {number} [options.retryFactor] - Exponential backoff factor
   * @param {number} [options.retryInterval] - Initial wait interval in milliseconds
   */
  async wait(requestId, options = {}) {
    if (!requestId || typeof requestId !== "string") {
      throw new PDKClientValidationError({
        details: [{ message: "requestId (string) is required" }],
      });
    }
    const DEFAULTS = { maxAttempts: 150, retryFactor: 1, retryInterval: 4000 };
    let maxAttempts = Number.isFinite(options.maxAttempts)
      ? options.maxAttempts
      : DEFAULTS.maxAttempts;
    maxAttempts = Math.max(1, Math.min(150, Math.floor(maxAttempts)));

    let retryFactor = Number.isFinite(options.retryFactor)
      ? options.retryFactor
      : DEFAULTS.retryFactor;
    retryFactor = Math.max(1, Math.min(3, retryFactor));

    let retryInterval = Number.isFinite(options.retryInterval)
      ? options.retryInterval
      : DEFAULTS.retryInterval;
    retryInterval = Math.max(1000, Math.min(60000, Math.floor(retryInterval)));

    const retries = maxAttempts;
    const factor = retryFactor;
    const minTimeout = retryInterval;

    let finalStatus;
    await retry(
      async () => {
        const s = await this.get(requestId);
        if (s && (s.status === "SUCCESS" || s.status === "FAILURE")) {
          finalStatus = s;
          return;
        }
        throw new Error("PENDING");
      },
      { retries, factor, minTimeout },
    );
    return finalStatus;
  }

  /**
   * Create prediction and wait until it completes. Returns the final result
   * @param {Object} arg
   * @param {string} arg.name - Name identifier in format "plugin_operation" (e.g. "erase_bg")
   * @param {Object} [arg.input]
   * @param {string} [arg.webhook]
   * @param {Object} [arg.options] - Polling options for wait { maxAttempts, retryFactor, retryInterval }
   * @returns {Promise<Object>}
   */
  async createAndWait({ name, input = {}, webhook, options = {} } = {}) {
    const job = await this.create({ name, input, webhook });
    const result = await this.wait(job._id, options);
    return result;
  }

  /**
   * Get public list of available predictions
   * @returns {Promise<Array<Object>>}
   */
  list() {
    const path = `/service/public/transformation/v1.0/predictions`;
    const query_params = {};
    return PlatformAPIClient.execute(
      this.config,
      "get",
      path,
      query_params,
      undefined,
    );
  }

  /**
   * Get the public input schema for a prediction by name
   * @param {string} name - Prediction name (e.g., "erase_bg")
   * @returns {Promise<Object>}
   */
  getSchema(name) {
    if (!name || typeof name !== "string") {
      return Promise.reject(
        new PDKClientValidationError({
          details: [{ message: "name (string) is required" }],
        }),
      );
    }
    const path = `/service/public/transformation/v1.0/predictions/schema/${name}`;
    const query_params = {};
    return PlatformAPIClient.execute(
      this.config,
      "get",
      path,
      query_params,
      undefined,
    );
  }
}

module.exports = { Predictions };
