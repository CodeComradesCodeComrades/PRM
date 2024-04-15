"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("orm/entities/users/User");
const CustomError_1 = require("utils/response/custom-error/CustomError");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    try {
        const user = yield userRepository.findOne({ where: { email } });
        if (user) {
            const customError = new CustomError_1.CustomError(400, 'General', 'User already exists', [
                `Email '${user.email}' already exists`,
            ]);
            return next(customError);
        }
        try {
            const newUser = new User_1.User();
            newUser.email = email;
            newUser.password = password;
            newUser.hashPassword();
            yield userRepository.save(newUser);
            res.customSuccess(200, 'User successfully created.');
        }
        catch (err) {
            const customError = new CustomError_1.CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
            return next(customError);
        }
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(400, 'Raw', 'Error', null, err);
        return next(customError);
    }
});
exports.register = register;
