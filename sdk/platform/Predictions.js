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
   * Wait for prediction to complete (SUCCESS/FAILURE) with default retry settings
   * Defaults: retries 150, factor 1, minTimeout 4000ms
   * @param {string} requestId
   */
  async wait(requestId) {
    if (!requestId || typeof requestId !== "string") {
      throw new PDKClientValidationError({
        details: [{ message: "requestId (string) is required" }],
      });
    }
    const DEFAULTS = { retries: 150, factor: 1, minTimeout: 4000 };
    const minTimeout = DEFAULTS.minTimeout;
    const retries = DEFAULTS.retries;

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
      { retries, factor: DEFAULTS.factor, minTimeout },
    );
    return finalStatus;
  }

  /**
   * Create prediction and wait until it completes. Returns the final result
   * @param {Object} arg
   * @param {string} arg.name - Name identifier in format "plugin_operation" (e.g. "erase_bg")
   * @param {Object} [arg.input]
   * @param {string} [arg.webhook]
   * @returns {Promise<Object>}
   */
  async createAndWait({ name, input = {}, webhook } = {}) {
    const job = await this.create({ name, input, webhook });
    const result = await this.wait(job._id);
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
