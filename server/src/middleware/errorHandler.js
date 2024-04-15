"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    return res.status(err.HttpStatusCode).json(err.JSON);
};
exports.errorHandler = errorHandler;
