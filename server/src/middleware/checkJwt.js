"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJwtToken_1 = require("../utils/createJwtToken");
const CustomError_1 = require("../utils/response/custom-error/CustomError");
const checkJwt = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const customError = new CustomError_1.CustomError(400, 'General', 'Authorization header not provided');
        return next(customError);
    }
    const token = authHeader.split(' ')[1];
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
        req.jwtPayload = jwtPayload;
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(401, 'Raw', 'JWT error', null, err);
        return next(customError);
    }
    try {
        // Refresh and send a new token on every request
        const newToken = (0, createJwtToken_1.createJwtToken)(jwtPayload);
        res.setHeader('token', `Bearer ${newToken}`);
        return next();
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(400, 'Raw', "Token can't be created", null, err);
        return next(customError);
    }
};
exports.checkJwt = checkJwt;
