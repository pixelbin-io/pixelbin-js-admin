const { getUrlParts } = require("./urlParts");
const { version2Regex, zoneSlug } = require("./regex");
const {
  PDKInvalidUrlError,
  PDKIllegalArgumentError,
  PDKIllegalQueryParameterError,
  PDKTransformationError,
} = require("../../common/PDKError");

const OPERATION_SEPARATOR = "~";
const PARAMETER_SEPARATOR = ",";
const PARAMETER_LINK = ":";

const getUrlFromObj = function (obj, config) {
  if (!obj.baseUrl) obj["baseUrl"] = "https://cdn.pixelbin.io";
  if (!obj.isCustomDomain && !obj.cloudName) {
    throw new PDKIllegalArgumentError("key cloudName should be defined");
  }
  if (obj.isCustomDomain && obj.cloudName) {
    throw new PDKIllegalArgumentError(
      "key cloudName is not valid for custom domains",
    );
  }
  if (!obj.worker && !obj.filePath)
    throw new PDKIllegalArgumentError("key filePath should be defined");
  if (obj.worker && typeof obj.workerPath !== "string")
    throw new PDKIllegalArgumentError("key workerPath should be a defined");
  if (obj.worker) {
    obj["pattern"] = "wrkr";
  } else {
    obj["pattern"] =
      getPatternFromTransformations(obj["transformations"], config) ||
      "original";
  }
  if (!obj.version || !version2Regex.test(obj.version)) obj.version = "v2";
  if (!obj.zone || !zoneSlug.test(obj.zone)) obj.zone = "";
  const urlKeySorted = ["baseUrl", "version", "cloudName", "zone", "pattern"];
  if (obj.worker) {
    urlKeySorted.push("workerPath");
  } else {
    urlKeySorted.push("filePath");
  }
  const urlArr = [];
  urlKeySorted.forEach((key) => {
    if (obj[key]) urlArr.push(obj[key]);
  });
  let queryArr = [];
  if (obj.options) {
    const { dpr, f_auto } = obj.options;
    if (dpr) {
      queryArr.push(`dpr=${parseDPR(dpr)}`);
    }
    if (f_auto) {
      validateFAuto(f_auto);
      queryArr.push(`f_auto=${f_auto}`);
    }
  }
  let urlStr = urlArr.join("/");
  if (queryArr.length) urlStr += "?" + queryArr.join("&");
  return urlStr;
};

const getObjFromUrl = function (url, config, flatten) {
  const parts = getPartsFromUrl(url, config);
  try {
    // Worker requests won't have a pattern
    parts.transformations = parts.pattern
      ? getTransformationDetailsFromPattern(parts.pattern, url, config, flatten)
      : [];
  } catch (err) {
    throw new PDKInvalidUrlError(
      "Error Processing url. Please check the url is correct",
    );
  }
  return parts;
};

const getUnArchivedPresets = (presets) => {
  return presets.filter((ele) => !ele.archived);
};

const rgbHex = function (red, green, blue, alpha) {
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
      throw new TypeError(
        `Expected alpha value (${alpha}) as a fraction or percentage`,
      );
    }

    alpha = (alpha | (1 << 8)).toString(16).slice(1); // eslint-disable-line no-bitwise
  } else {
    alpha = "";
  }
  /* eslint-disable no-bitwise */
  return (
    (blue | (green << 8) | (red << 16) | (1 << 24)).toString(16).slice(1) +
    alpha
  );
  /* eslint-enable no-bitwise */
};

const getPatternFromTransformations = function (transformationList, config) {
  return transformationList && transformationList.length
    ? transformationList
        .map((o) => {
          /* eslint-disable no-prototype-builtins */
          if (o.hasOwnProperty("name")) {
            /* eslint-enable no-prototype-builtins */
            o.values = o.values || [];
            const paramsStr = o.values
              .map(({ key, value }) => {
                if (!key) {
                  throw new PDKIllegalArgumentError(
                    `key not specified in '${o.name}'`,
                  );
                }
                if (!value) {
                  throw new PDKIllegalArgumentError(
                    `value not specified for key '${key}' in '${o.name}'`,
                  );
                }
                return `${key}:${value}`;
              })
              .join(config.parameterSeparator);
            if (o.plugin === "p") {
              return paramsStr
                ? `${o.plugin}:${o.name}(${paramsStr})`
                : `${o.plugin}:${o.name}`;
            }
            return `${o.plugin}.${o.name}(${paramsStr})`;
          } else {
            return null;
          }
        })
        .filter((ele) => ele) // Remove invalid transforms.
        .join(config.operationSeparator)
    : null;
};

const getPartsFromUrl = function (url, config) {
  const parts = getUrlParts(url, config);
  const queryObj = processQueryParams(parts);

  return {
    baseUrl: `${parts["protocol"]}//${parts["host"]}`,
    filePath: parts["filePath"],
    pattern: parts["pattern"],
    version: parts["version"],
    zone: parts["zoneSlug"],
    cloudName: parts["cloudName"],
    worker: parts["worker"],
    workerPath: parts["workerPath"],
    options: { ...queryObj },
  };
};

function removeLeadingDash(str) {
  if (str.charAt(0) === "-") {
    return str.substr(1);
  }
  return str;
}

function getParamsList(dSplit, prefix) {
  return removeLeadingDash(
    dSplit.split("(")[1].replace(")", "").replace(prefix, ""),
  ).split(PARAMETER_SEPARATOR);
}

function getParamsObject(paramsList) {
  const params = {};
  paramsList.forEach((item) => {
    const [param, val] = item.split(PARAMETER_LINK);
    if (param) params[param] = val;
  });
  return params;
}

function getOperationDetailsFromOperation(dSplit) {
  // Figure Out Module
  const fullFnName = dSplit.split("(")[0];

  let pluginId = fullFnName.split(".")[0];
  let operationName = fullFnName.split(".")[1];
  if (dSplit.startsWith("p:")) {
    pluginId = fullFnName.split(":")[0];
    operationName = fullFnName.split(":")[1];
  }

  let values = null;
  if (pluginId === "p") {
    if (dSplit.includes("(")) {
      values = getParamsObject(getParamsList(dSplit, ""));
    }
  } else {
    values = getParamsObject(getParamsList(dSplit, ""));
  }
  // const [plugin, name] = dSplit.split("(")[0].split(".");
  const transformation = {
    values: values,
    plugin: pluginId,
    name: operationName,
  };
  if (!transformation.values) delete transformation["values"];
  return transformation;
}

const getTransformationDetailsFromPattern = function (
  pattern,
  url,
  config,
  flatten = false,
) {
  if (pattern === "original") {
    return [];
  }

  const dSplit = pattern.split(config.operationSeparator);
  let opts = dSplit
    .map((x) => {
      let { name, plugin, values } = getOperationDetailsFromOperation(x);
      if (values && Object.keys(values).length) {
        values = Object.keys(values).map((key) => {
          return {
            key: key,
            value: values[key],
          };
        });

        return {
          name,
          plugin,
          values,
        };
      }

      return {
        name,
        plugin,
      };
    })
    .flat(); // Flatten preset sub-lists
  if (flatten) opts = opts.flat();
  return opts;
};

function getPresetNameAndPattern(preset) {
  let presetName;
  let presetPattern;
  if (preset.startsWith("p:")) {
    presetPattern = preset.split("p:")[1];
    presetName = presetPattern.split("(")[0];
  }
  if (preset.startsWith("p.apply")) {
    let intContent = preset.slice(preset.indexOf("(") + 1).replace(")", "");
    const presetParams = getParamsObject(getParamsList(preset));
    presetName = presetParams.n;
    presetPattern = intContent.slice(intContent.indexOf(PARAMETER_LINK) + 1);
  }

  return { presetName, presetPattern };
}

const parseDPR = (dpr) => {
  if (dpr === "auto") return dpr;
  dpr = +dpr;
  if (isNaN(dpr) || dpr < 0.1 || dpr > 5.0)
    throw new PDKIllegalQueryParameterError(
      "DPR value should be numeric and should be between 0.1 to 5.0",
    );
  return dpr;
};

const validateFAuto = (f_auto) => {
  if (typeof f_auto !== "boolean")
    throw new PDKIllegalQueryParameterError("F_auto value should be boolean");
};

const processQueryParams = (urlParts) => {
  const queryParams = urlParts.search.substring(1).split("&");
  let queryObj = {};
  for (const params of queryParams) {
    const queryElements = params.split("=");
    if (queryElements[0] === "dpr") {
      const dpr = queryElements[1];
      queryObj[queryElements[0]] = parseDPR(dpr);
    }
    if (queryElements[0] === "f_auto") {
      const f_auto = queryElements[1].toLowerCase() === "true";
      validateFAuto(f_auto);
      queryObj[queryElements[0]] = f_auto;
    }
  }
  return queryObj;
};

module.exports = {
  getUrlFromObj,
  getObjFromUrl,
  getUnArchivedPresets,
  rgbHex,
};
