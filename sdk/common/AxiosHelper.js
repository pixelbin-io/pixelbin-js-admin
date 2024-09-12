const { default: axios } = require("axios");
const querystring = require("query-string");
const { sign } = require("./RequestSigner");
const { PDKServerResponseError } = require("./PDKError");
const FormData = require("form-data");

/**
 * https://github.com/axios/axios/blob/5b8a826771b77ab30081d033fdba9ef3b90e439a/lib/helpers/isAbsoluteURL.js
 * Determines whether the specified URL is absolute
 * @ignore
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * https://github.com/axios/axios/blob/5b8a826771b77ab30081d033fdba9ef3b90e439a/lib/helpers/combineURLs.js
 * Creates a new URL by combining the specified URLs
 * @ignore
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
}

axios.defaults.withCredentials = true;

function transformRequestOptions(params) {
    let options = "";

    for (const key in params) {
        if (typeof params[key] !== "object" && typeof params[key] !== "undefined") {
            const encodeVal = encodeURIComponent(params[key]);
            options += `${key}=${encodeVal}&`;
        } else if (Array.isArray(params[key])) {
            // eslint-disable-next-line no-loop-func
            params[key].forEach((el) => {
                const encodeVal = encodeURIComponent(params[key]);
                options += `${key}=${encodeVal}&`;
            });
        } else if (typeof params[key] === "object" && params[key]) {
            options += transformRequestOptions(params[key]);
        }
    }
    return options ? options.slice(0, -1) : options;
}

function getTransformer(config) {
    const { transformRequest } = config;

    if (transformRequest) {
        if (typeof transformRequest === "function") {
            return transformRequest;
        } else if (transformRequest.length) {
            return transformRequest[0];
        }
    }

    throw new Error("Could not get default transformRequest function from Axios defaults");
}

function processQueryParams({ params, search }) {
    let queryParam = "";
    if (params && Object.keys(params).length) {
        if (search && search.trim() !== "") {
            queryParam = `&${transformRequestOptions(params)}`;
        } else {
            queryParam = `?${transformRequestOptions(params)}`;
        }
    }
    return queryParam;
}

function base64Encode(text) {
    return Buffer.from(text).toString("base64");
}

function interceptorFn(options) {
    return (config) => {
        if (!config.url) {
            throw new Error("No URL present in request config, unable to sign request");
        }

        let url = config.url;
        if (config.baseURL && !isAbsoluteURL(config.url)) {
            url = combineURLs(config.baseURL, config.url);
        }
        if (url.startsWith("/api") && isBrowser) {
            url = `https://${window.location.host}${url}`;
        }
        const { host, pathname, search } = new URL(url);
        if (
            pathname.startsWith("/service/platform") ||
            pathname.startsWith("/api/service/platform")
        ) {
            const { data, headers, method, params } = config;
            const queryParam = processQueryParams({ params, search });
            const transformRequest = getTransformer(config);
            const transformedData = transformRequest(data, headers);

            // Remove all the default Axios headers
            const {
                common,
                delete: _delete, // 'delete' is a reserved word
                get,
                head,
                post,
                put,
                patch,
                ...headersToSign
            } = headers;

            const signingOptions = {
                method: method && method.toUpperCase(),
                host: host,
                path: pathname + search + queryParam,
                body: transformedData,
                headers: headersToSign,
            };
            if (signingOptions["body"] && signingOptions["body"] instanceof FormData) {
                delete signingOptions["body"];
            }
            sign(signingOptions);
            config.headers["x-ebg-param"] = base64Encode(signingOptions.headers["x-ebg-param"]);
            config.headers["x-ebg-signature"] = signingOptions.headers["x-ebg-signature"];
        }
        return config;
    };
}

function userAgentInterceptor(options) {
    return (config) => {
        const sdk = {
            name: "@pixelbin/admin",
            version: "4.1.1",
        };
        const language = "JavaScript";

        let userAgent = `${sdk.name}/${sdk.version} (${language})`;
        const integrationPlatform = config.headers["user-agent"];
        if (integrationPlatform) {
            userAgent = `${integrationPlatform} ${userAgent}`;
        }
        config.headers["user-agent"] = userAgent;
        return config;
    };
}

const pdkAxios = axios.create({
    paramsSerializer: (params) => {
        return querystring.stringify(params);
    },
});
/**
 * Skipping signature check for URLS starting with `/service/platform/` i.e. platform APIs of all services.
 */
// pdkAxios.interceptors.request.use(interceptorFn());
pdkAxios.interceptors.request.use(userAgentInterceptor());
pdkAxios.interceptors.response.use(
    function (response) {
        if (response.config.method == "head") {
            return response.headers;
        }
        return response.data; // IF 2XX then return response.data only
    },
    function (error) {
        if (error.response) {
            // Request made and server responded
            throw new PDKServerResponseError(
                error.response.data.message || error.message,
                error.response.data.stack || error.stack,
                error.response.statusText,
                error.response.status,
                error.response.data,
            );
        } else if (error.request) {
            // The request was made but no error.response was received
            throw new PDKServerResponseError(error.message, error.stack, error.code, error.code);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new PDKServerResponseError(error.message, error.stack);
        }
    },
);

/**
 * Uploader Axios
 * @ignore
 * @type {import("axios").AxiosInstance}
 */
const uploaderAxios = axios.create();
uploaderAxios.interceptors.request.use(userAgentInterceptor());
uploaderAxios.interceptors.response.use(
    function (response) {
        if (response.config.method == "head") {
            return response.headers;
        }
        return response.data; // IF 2XX then return response.data only
    },
    function (error) {
        if (error.response) {
            // Request made and server responded
            throw new PDKServerResponseError(
                error.response.data.message || error.message,
                error.response.data.stack || error.stack,
                error.response.statusText,
                error.response.status,
                error.response.data,
            );
        } else if (error.request) {
            // The request was made but no error.response was received
            throw new PDKServerResponseError(error.message, error.stack, error.code, error.code);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new PDKServerResponseError(error.message, error.stack);
        }
    },
);

module.exports = {
    pdkAxios,
    uploaderAxios,
};
