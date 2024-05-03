import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserCore } from 'src/core/user.core';
import { AuthDto } from 'src/dto/auth.dto';
import { CreateUserDto, UserDto, UserResponseDto, mapUser } from 'src/dto/user.dto';
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

    getMe(authDto: AuthDto): Promise<UserResponseDto> {
        return this.findOrFail(authDto.user.id).then(mapUser);
    }

    private async findOrFail(id: string) {
        const user = await this.userRepository.get(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }
}
