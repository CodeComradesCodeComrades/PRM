"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorLogin = void 0;
const validator_1 = __importDefault(require("validator"));
const CustomError_1 = require("utils/response/custom-error/CustomError");
const validatorLogin = (req, res, next) => {
    let { email, password } = req.body;
    const errorsValidation = [];
    email = !email ? '' : email;
    password = !password ? '' : password;
    if (!validator_1.default.isEmail(email)) {
        errorsValidation.push({ email: 'Email is invalid' });
    }
    if (validator_1.default.isEmpty(email)) {
        errorsValidation.push({ email: 'Email field is required' });
    }
    if (validator_1.default.isEmpty(password)) {
        errorsValidation.push({ password: 'Password field is required' });
    }
    if (errorsValidation.length !== 0) {
        const customError = new CustomError_1.CustomError(400, 'Validation', 'Login validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
exports.validatorLogin = validatorLogin;
