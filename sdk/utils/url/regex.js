exports.version2Regex = /^v[1-2]$/;
exports.pixelbinDomainRegex = {
    urlWithZone: /^\/([a-zA-Z0-9_-]*)\/([a-zA-Z0-9_-]{6})\/(.+)\/(.*)$/,
    urlWithoutZone: /^\/([a-zA-Z0-9_-]*)\/(.+)\/(.*)/,
    urlWithWorkerAndZone: /^\/([a-zA-Z0-9_-]*)\/([a-zA-Z0-9_-]{6})\/wrkr\/(.*)$/,
    urlWithWorker: /^\/([a-zA-Z0-9_-]*)\/wrkr\/(.*)$/,
};
exports.customDomainRegex = {
    urlWithZone: /^\/([a-zA-Z0-9_-]{6})\/(.+)\/(.*)$/,
    urlWithoutZone: /^\/(.+)\/(.*)/,
    urlWithWorkerAndZone: /^\/([a-zA-Z0-9_-]{6})\/wrkr\/(.*)$/,
    urlWithWorker: /^\/wrkr\/(.*)$/,
};
exports.zoneSlug = /([a-zA-Z0-9_-]{6})/;
