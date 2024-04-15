"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorChangePassword = void 0;
const validator_1 = __importDefault(require("validator"));
const ConstsUser_1 = require("consts/ConstsUser");
const CustomError_1 = require("utils/response/custom-error/CustomError");
const validatorChangePassword = (req, res, next) => {
    let { password, passwordNew, passwordConfirm } = req.body;
    const errorsValidation = [];
    password = !password ? '' : password;
    passwordNew = !passwordNew ? '' : passwordNew;
    passwordConfirm = !passwordConfirm ? '' : passwordConfirm;
    if (validator_1.default.isEmpty(password)) {
        errorsValidation.push({ password: 'Password is required' });
    }
    if (validator_1.default.isEmpty(passwordNew)) {
        errorsValidation.push({ passwordNew: 'New password is required' });
    }
    if (validator_1.default.isEmpty(passwordConfirm)) {
        errorsValidation.push({ passwordConfirm: 'Password confirm is required' });
    }
    if (!validator_1.default.isLength(passwordNew, { min: ConstsUser_1.ConstsUser.PASSWORD_MIN_CHAR })) {
        errorsValidation.push({
            passwordNew: `Password must be at least ${ConstsUser_1.ConstsUser.PASSWORD_MIN_CHAR} characters`,
        });
    }
    if (!validator_1.default.equals(passwordNew, passwordConfirm)) {
        errorsValidation.push({ passwordConfirm: 'Passwords must match' });
    }
    if (errorsValidation.length !== 0) {
        const customError = new CustomError_1.CustomError(400, 'Validation', 'Change password validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
exports.validatorChangePassword = validatorChangePassword;
