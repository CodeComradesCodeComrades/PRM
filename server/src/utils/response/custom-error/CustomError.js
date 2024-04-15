"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(httpStatusCode, errorType, message, errors = null, errorRaw = null, errorsValidation = null) {
        super(message);
        this.name = this.constructor.name;
        this.httpStatusCode = httpStatusCode;
        this.errorType = errorType;
        this.errors = errors;
        this.errorRaw = errorRaw;
        this.errorsValidation = errorsValidation;
    }
    get HttpStatusCode() {
        return this.httpStatusCode;
    }
    get JSON() {
        return {
            errorType: this.errorType,
            errorMessage: this.message,
            errors: this.errors,
            errorRaw: this.errorRaw,
            errorsValidation: this.errorsValidation,
            stack: this.stack,
        };
    }
}
exports.CustomError = CustomError;
