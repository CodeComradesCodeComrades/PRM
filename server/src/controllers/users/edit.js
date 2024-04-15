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
exports.edit = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("orm/entities/users/User");
const CustomError_1 = require("utils/response/custom-error/CustomError");
const edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { username, name } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    try {
        const user = yield userRepository.findOne({ where: { id } });
        if (!user) {
            const customError = new CustomError_1.CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
            return next(customError);
        }
        user.username = username;
        user.name = name;
        try {
            yield userRepository.save(user);
            res.customSuccess(200, 'User successfully saved.');
        }
        catch (err) {
            const customError = new CustomError_1.CustomError(409, 'Raw', `User '${user.email}' can't be saved.`, null, err);
            return next(customError);
        }
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(400, 'Raw', 'Error', null, err);
        return next(customError);
    }
});
exports.edit = edit;
