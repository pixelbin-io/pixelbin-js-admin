class PDKServerResponseError extends Error {
    /**
     * @param  {string} message
     * @param  {string} stackTrace
     * @param  {string} [status]
     * @param  {string} [code]
     */
    constructor(message, stackTrace, status = null, code = null, details = null) {
        super(message);
        this.name = "PDKServerResponseError";
        this.stackTrace = stackTrace;
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

class PDKClientValidationError extends Error {
    constructor(errObj) {
        super(errObj.message);
        this.name = "PDKClientValidationError";
        this.details = errObj.details;
    }
}

class PDKInvalidCredentialError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKInvalidCredentialError";
    }
}
class PDKTokenIssueError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKTokenIssueError";
    }
}
class PDKOAuthCodeError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKOAuthCodeError";
    }
}

class PDKInvalidUrlError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKInvalidUrlError";
    }
}
class PDKIllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKIllegalArgumentError";
    }
}

class PDKIllegalQueryParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKIllegalQueryParameterError";
    }
}

class PDKTransformationError extends Error {
    constructor(message) {
        super(message);
        this.name = "PDKTransformationError";
    }
}

module.exports = {
    PDKServerResponseError,
    PDKClientValidationError,
    PDKInvalidCredentialError,
    PDKTokenIssueError,
    PDKOAuthCodeError,
    PDKInvalidUrlError,
    PDKIllegalArgumentError,
    PDKIllegalQueryParameterError,
    PDKTransformationError,
};
