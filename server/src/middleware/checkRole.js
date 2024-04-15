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
exports.checkRole = void 0;
const CustomError_1 = require("../utils/response/custom-error/CustomError");
const checkRole = (roles, isSelfAllowed = false) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, role } = req.jwtPayload;
        const { id: requestId } = req.params;
        let errorSelfAllowed = null;
        if (isSelfAllowed) {
            if (id === parseInt(requestId)) {
                return next();
            }
            errorSelfAllowed = 'Self allowed action.';
        }
        if (roles.indexOf(role) === -1) {
            const errors = [
                'Unauthorized - Insufficient user rights',
                `Current role: ${role}. Required role: ${roles.toString()}`,
            ];
            if (errorSelfAllowed) {
                errors.push(errorSelfAllowed);
            }
            const customError = new CustomError_1.CustomError(401, 'Unauthorized', 'Unauthorized - Insufficient user rights', errors);
            return next(customError);
        }
        return next();
    });
};
exports.checkRole = checkRole;
