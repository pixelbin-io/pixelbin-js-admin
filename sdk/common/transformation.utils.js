const path = require("path");
const { getUrlParts, version2Regex } = require("./utils");

function isZoneSlug(text) {
    return text.match(/^[a-zA-Z0-9_-]{6}$/);
}

module.exports.getImageUrlWithOptions = function (url, pattern, version = "v2") {
    const urlParts = getUrlParts(url);
    if (!version2Regex.test(version))
        throw new PDKInvalidUrlError(
            "Invalid pixelbin url. Please make sure the version is correct.",
        );
    urlParts["pattern"] = pattern;
    urlParts["version"] = version;
    const urlKeySorted = ["host", "version", "cloudName", "zoneSlug", "pattern", "filePath"];
    const urlArr = [];
    urlKeySorted.forEach((key) => {
        if (urlParts[key]) urlArr.push(urlParts[key]);
    });
    return `https://${urlArr.join("/")}`;
};
const HexRe = /[0-9a-f]{6}/;

const Validators = {
    integer: (value, schema) => {
        return Number.isInteger(Number(value));
    },
    string: (value, schema) => {
        return Object.prototype.toString.call(value) === "[object String]";
    },
    color: (value, schema) => {
        value = value || "";
        if (value.length === 6 && HexRe.test(value)) {
            return true;
        } else if (value.length === 8 && HexRe.test(value)) {
            return true;
        }
        return false;
    },
    enum: (value, schema) => {
        const xenum = schema.enum || [];
        return xenum.includes(value);
    },
    boolean: (value, schema) => {
        return (
            value === false ||
            value === true ||
            value === "true" ||
            value === "false" ||
            value === "0" ||
            value === "1"
        );
    },
    file: (value, schema) => {
        return Object.prototype.toString.call(value) === "[object String]";
    },
};

function removeLeadingDash(str) {
    if (str.charAt(0) === "-") {
        return str.substr(1);
    }
    return str;
}

function getParamsList(dSplit, prefix) {
    return removeLeadingDash(dSplit.split("(")[1].replace(")", "").replace(prefix, "")).split(",");
}

function getParamsObject(paramsList) {
    const params = [];
    paramsList.forEach((item) => {
        const [param, val] = item.split(":");
        if (param) {
            params.push({
                key: param,
                value: val,
            });
        }
    });
    return params.length && params;
}

function txtToOptions(dSplit, originalFormat, config, flatten, isPreset = false) {
    // Figure Out Module
    const fullFnName = dSplit.split("(")[0];
    const [pluginId, operationName] = fullFnName.split(".");

    if (fullFnName === "p.apply") {
        if (isPreset) {
            // Nested preset
            return;
        }
        const params = getParamsObject(getParamsList(dSplit, ""));
        const presetName = params.find(({ key, value }) => key === "n");
        if (presetName && presetName.key) {
            return {
                name: presetName.value,
                isPreset: true,
            };
        }
        return;
    }

    const values = getParamsObject(getParamsList(dSplit, "."));
    const [plugin, name] = dSplit.split("(")[0].split(".");
    const transformation = {
        values: values,
        plugin,
        name,
        isPreset: false,
    };
    if (!transformation.values) delete transformation["values"];
    return transformation;
}

const getTransformationsFromPattern = function (pattern, url, config, flatten = false) {
    const originalFormat = path.extname(url).replace(".", "");
    if (pattern === "original") {
        return [];
    }

    const dSplit = pattern.split(config.delimiters.operationSeparator);
    let opts = dSplit
        .map((x) => {
            if (x.startsWith("p:")) {
                const [, presetString] = x.split(":");
                return {
                    name: presetString,
                    isPreset: true,
                };
            }
            return txtToOptions(x, originalFormat, config, flatten);
        })
        .flat(); // Flatten preset sub-lists
    if (flatten) opts = opts.flat();
    return opts;
};

module.exports.getTransformationsFromUrl = function (url, config, flatten) {
    // const pattern = getTransformationPatternFromURL(url);
    const { pattern } = getUrlParts(url);
    // const extname = path.extname(url).replace(".", "");
    return getTransformationsFromPattern(pattern, url, config, flatten);
};

module.exports.getOriginalFormOfUrl = function (url) {
    return getImageUrlWithOptions(url, "original");
};

module.exports.getUrlTransformationString = function (transformationList, config) {
    return transformationList && transformationList.length
        ? transformationList
              .map((o) => {
                  if (o) {
                      if (o.isPreset) {
                          return `p:${o.name}`;
                      } else {
                          o.values = o.values || [];
                          const paramsStr = o.values
                              .map(({ key, value }) => {
                                  return `${key}:${value}`;
                              })
                              .join(config.delimiters.parameterSeparator);
                          return `${o.plugin}.${o.name}(${paramsStr})`;
                      }
                  } else {
                      return null;
                  }
              })
              .filter((ele) => ele) // Remove invalid transforms.
              .join(config.delimiters.operationSeparator)
        : null;
};

module.exports.getUnArchivedPresets = (presets) => {
    return presets.filter((ele) => !ele.archived);
};

module.exports.rgbHex = function (red, green, blue, alpha) {
    const isPercent = (red + (alpha || "")).toString().includes("%");

    if (typeof red === "string") {
        [red, green, blue, alpha] = red
            .match(/(0?\.?\d{1,3})%?\b/g)
            .map((component) => Number(component));
    } else if (alpha !== undefined) {
        alpha = Number.parseFloat(alpha);
    }

    if (
        typeof red !== "number" ||
        typeof green !== "number" ||
        typeof blue !== "number" ||
        red > 255 ||
        green > 255 ||
        blue > 255
    ) {
        throw new TypeError("Expected three numbers below 256");
    }

    if (typeof alpha === "number") {
        if (!isPercent && alpha >= 0 && alpha <= 1) {
            alpha = Math.round(255 * alpha);
        } else if (isPercent && alpha >= 0 && alpha <= 100) {
            alpha = Math.round((255 * alpha) / 100);
        } else {
            throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
        }

        alpha = (alpha | (1 << 8)).toString(16).slice(1); // eslint-disable-line no-bitwise
    } else {
        alpha = "";
    }

    return (blue | (green << 8) | (red << 16) | (1 << 24)).toString(16).slice(1) + alpha; // eslint-disable-line no-bitwise
};
