"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = void 0;
const getLanguage = (req, res, next) => {
    const acceptLanguageHeader = req.get('Accept-Language');
    if (!acceptLanguageHeader) {
        req.language = 'en-US';
        return next();
    }
    req.language = acceptLanguageHeader;
    return next();
};
exports.getLanguage = getLanguage;
