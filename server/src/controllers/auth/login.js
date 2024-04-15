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
exports.login = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("orm/entities/users/User");
const createJwtToken_1 = require("utils/createJwtToken");
const CustomError_1 = require("utils/response/custom-error/CustomError");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    try {
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            const customError = new CustomError_1.CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
            return next(customError);
        }
        if (!user.checkIfPasswordMatch(password)) {
            const customError = new CustomError_1.CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
            return next(customError);
        }
        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        };
        try {
            const token = (0, createJwtToken_1.createJwtToken)(jwtPayload);
            res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
        }
        catch (err) {
            const customError = new CustomError_1.CustomError(400, 'Raw', "Token can't be created", null, err);
            return next(customError);
        }
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(400, 'Raw', 'Error', null, err);
        return next(customError);
    }
});
exports.login = login;
