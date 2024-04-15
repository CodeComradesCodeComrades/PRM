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
describe('Users', () => {
    let dbConnection;
    let userRepository;
    const userPassword = 'pass1';
    let adminUserToken = null;
    const adminUser = new User_1.User();
    adminUser.username = 'Badger';
    adminUser.name = 'Brandon Mayhew';
    adminUser.email = 'brandon.mayhew@test.com';
    adminUser.password = userPassword;
    adminUser.hashPassword();
    adminUser.role = 'ADMINISTRATOR';
    let standardUserToken = null;
    const standardUser = new User_1.User();
    standardUser.username = 'Toddy';
    standardUser.name = 'Todd Alquist';
    standardUser.email = 'todd.alquist@test.com';
    standardUser.password = userPassword;
    standardUser.hashPassword();
    standardUser.role = 'STANDARD';
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        dbConnection = yield (0, dbCreateConnection_1.dbCreateConnection)();
        userRepository = (0, typeorm_1.getRepository)(User_1.User);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userRepository.save([adminUser, standardUser]);
        let res = yield (0, supertest_1.agent)(__1.app).post('/v1/auth/login').send({ email: adminUser.email, password: userPassword });
        adminUserToken = res.body.data;
        res = yield (0, supertest_1.agent)(__1.app).post('/v1/auth/login').send({ email: standardUser.email, password: userPassword });
        standardUserToken = res.body.data;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userRepository.delete([adminUser.id, standardUser.id]);
    }));
    describe('GET /v1/auth/users', () => {
        it('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.agent)(__1.app).get('/v1/users').set('Authorization', adminUserToken);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.message).to.equal('List of users.');
            (0, chai_1.expect)(res.body.data[3].email).to.eql('hank.schrader@test.com');
        }));
        it('should report error of unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.agent)(__1.app).get('/v1/users').set('Authorization', standardUserToken);
            (0, chai_1.expect)(res.status).to.equal(401);
            (0, chai_1.expect)(res.body.errorType).to.equal('Unauthorized');
            (0, chai_1.expect)(res.body.errorMessage).to.equal('Unauthorized - Insufficient user rights');
            (0, chai_1.expect)(res.body.errors).to.eql([
                'Unauthorized - Insufficient user rights',
                'Current role: STANDARD. Required role: ADMINISTRATOR',
            ]);
            (0, chai_1.expect)(res.body.errorRaw).to.an('null');
            (0, chai_1.expect)(res.body.errorsValidation).to.an('null');
        }));
    });
    describe('GET /v1/auth/users//:id([0-9]+)', () => {
        it('should get user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userRepository.findOne({ email: adminUser.email });
            const res = yield (0, supertest_1.agent)(__1.app).get(`/v1/users/${user.id}`).set('Authorization', adminUserToken);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.message).to.equal('User found');
            (0, chai_1.expect)(res.body.data.email).to.eql(adminUser.email);
        }));
    });
});
