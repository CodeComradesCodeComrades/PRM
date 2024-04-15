"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
express_1.response.customSuccess = function (httpStatusCode, message, data = null) {
    return this.status(httpStatusCode).json({ message, data });
};
