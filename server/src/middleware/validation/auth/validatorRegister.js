"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorRegister = void 0;
const validator_1 = __importDefault(require("validator"));
const ConstsUser_1 = require("consts/ConstsUser");
const CustomError_1 = require("utils/response/custom-error/CustomError");
const validatorRegister = (req, res, next) => {
    let { email, password, passwordConfirm } = req.body;
    const errorsValidation = [];
    email = !email ? '' : email;
    password = !password ? '' : password;
    passwordConfirm = !passwordConfirm ? '' : passwordConfirm;
    if (!validator_1.default.isEmail(email)) {
        errorsValidation.push({ email: 'Email is invalid' });
    }
    if (validator_1.default.isEmpty(email)) {
        errorsValidation.push({ email: 'Email is required' });
    }
    if (validator_1.default.isEmpty(password)) {
        errorsValidation.push({ password: 'Password is required' });
    }
    if (!validator_1.default.isLength(password, { min: ConstsUser_1.ConstsUser.PASSWORD_MIN_CHAR })) {
        errorsValidation.push({
            password: `Password must be at least ${ConstsUser_1.ConstsUser.PASSWORD_MIN_CHAR} characters`,
        });
    }
    if (validator_1.default.isEmpty(passwordConfirm)) {
        errorsValidation.push({ passwordConfirm: 'Confirm password is required' });
    }
    if (!validator_1.default.equals(password, passwordConfirm)) {
        errorsValidation.push({ passwordConfirm: 'Passwords must match' });
    }
    if (errorsValidation.length !== 0) {
        const customError = new CustomError_1.CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
exports.validatorRegister = validatorRegister;
