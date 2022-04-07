const combineURLs = require("axios/lib/helpers/combineURLs");
const isAbsoluteURL = require("axios/lib/helpers/isAbsoluteURL");
const axios = require("axios");
const querystring = require("query-string");
const { sign } = require("./RequestSigner");
const { PDKServerResponseError } = require("./PDKError");
const FormData = require("form-data");

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

const pdkAxios = axios.create({
    paramsSerializer: (params) => {
        return querystring.stringify(params);
    },
});

pdkAxios.interceptors.request.use(interceptorFn());
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

module.exports = {
    pdkAxios,
};
