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
exports.SeedUsers1590519635401 = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/users/User");
class SeedUsers1590519635401 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new User_1.User();
            const userRepository = (0, typeorm_1.getRepository)(User_1.User);
            user.username = 'Heisenberg';
            user.name = 'Walter White';
            user.email = 'admin@admin.com';
            user.password = 'pass1';
            user.hashPassword();
            user.role = 'ADMINISTRATOR';
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Jesse';
            user.name = 'Jesse Pinkman';
            user.email = 'standard@standard.com';
            user.password = 'pass1';
            user.hashPassword();
            user.role = 'STANDARD';
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Sky';
            user.name = 'Skyler White';
            user.email = 'skyler.white@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Hank';
            user.name = 'Hank Schrader';
            user.email = 'hank.schrader@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Marie';
            user.name = 'Marie Schrader';
            user.email = 'marie.schrader@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'The Lawyer';
            user.name = 'Saul Goodman';
            user.email = 'saul.goodman@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Gus';
            user.name = 'Gustavo Fring';
            user.email = 'gustavo.fring@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Mike';
            user.name = 'Michael Ehrmantraut';
            user.email = 'michael.ehrmantraut@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Tio';
            user.name = 'Hector Salamanca';
            user.email = 'hector.salamanca@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
            user = new User_1.User();
            user.username = 'Tuco';
            user.name = 'Alberto Salamanca';
            user.email = 'alberto.salamanca@test.com';
            user.password = 'pass1';
            user.hashPassword();
            yield userRepository.save(user);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Not implemented');
        });
    }
}
exports.SeedUsers1590519635401 = SeedUsers1590519635401;
