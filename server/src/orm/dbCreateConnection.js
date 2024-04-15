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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbCreateConnection = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("./config/ormconfig"));
const dbCreateConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, typeorm_1.createConnection)(ormconfig_1.default);
        console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
    }
    catch (err) {
        if (err.name === 'AlreadyHasActiveConnectionError') {
            const activeConnection = (0, typeorm_1.getConnectionManager)().get(ormconfig_1.default.name);
            return activeConnection;
        }
        console.log(err);
    }
    return null;
});
exports.dbCreateConnection = dbCreateConnection;
