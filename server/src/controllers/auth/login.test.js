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
require("mocha");
const chai_1 = require("chai");
const supertest_1 = require("supertest");
const typeorm_1 = require("typeorm");
const dbCreateConnection_1 = require("orm/dbCreateConnection");
const User_1 = require("orm/entities/users/User");
const __1 = require("../../");
describe('Login', () => {
    let dbConnection;
    let userRepository;
    const userPassword = 'pass1';
    const user = new User_1.User();
    user.username = 'Badger';
    user.name = 'Brandon Mayhew';
    user.email = 'brandon.mayhew@test.com';
    user.password = userPassword;
    user.hashPassword();
    user.role = 'ADMINISTRATOR';
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        dbConnection = yield (0, dbCreateConnection_1.dbCreateConnection)();
        userRepository = (0, typeorm_1.getRepository)(User_1.User);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userRepository.save(user);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userRepository.delete(user.id);
    }));
    it('should return a JWT token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(__1.app).post('/v1/auth/login').send({ email: user.email, password: userPassword });
        (0, chai_1.expect)(res.status).to.equal(200);
        (0, chai_1.expect)(res.body.message).to.equal('Token successfully created.');
        (0, chai_1.expect)(res.body.data).not.to.be.empty;
        (0, chai_1.expect)(res.body.data).to.be.an('string');
    }));
    it("should report error when email and password don't match", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(__1.app).post('/v1/auth/login').send({ email: user.email, password: 'wrong_password' });
        (0, chai_1.expect)(res.status).to.equal(404);
        (0, chai_1.expect)(res.body.errorType).to.equal('General');
        (0, chai_1.expect)(res.body.errors).to.eql(['Incorrect email or password']);
        (0, chai_1.expect)(res.body.errorRaw).to.an('null');
        (0, chai_1.expect)(res.body.errorsValidation).to.an('null');
    }));
    it('should report error when the email provided is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(__1.app).post('/v1/auth/login').send({ email: 'not_valid_email', password: userPassword });
        (0, chai_1.expect)(res.status).to.equal(400);
        (0, chai_1.expect)(res.body.errorType).to.equal('Validation');
        (0, chai_1.expect)(res.body.errorMessage).to.equal('Login validation error');
        (0, chai_1.expect)(res.body.errors).to.an('null');
        (0, chai_1.expect)(res.body.errorRaw).to.an('null');
        (0, chai_1.expect)(res.body.errorsValidation).to.eql([
            {
                email: 'Email is invalid',
            },
        ]);
    }));
});
