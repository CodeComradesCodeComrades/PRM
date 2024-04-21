import { Inject, Injectable } from '@nestjs/common';
import { UserCore } from 'src/core/user.core';
import { CreateUserDto, UserDto, mapUser } from 'src/dto/user.dto';
import { ICryptoRepository } from 'src/interfaces/crypto.interface';
import { IUserRepository } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
    private userCore: UserCore;

    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
    ) {
        this.userCore = UserCore.create(userRepository, cryptoRepository);
    }

    create(createUserDto: CreateUserDto): Promise<UserDto> {
        return this.userCore.createUser(createUserDto).then(mapUser);
    }
}
