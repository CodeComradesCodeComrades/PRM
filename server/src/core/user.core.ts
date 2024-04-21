import { BadRequestException } from '@nestjs/common';
import { SALT_ROUNDS } from 'src/constants';
import { UserEntity } from 'src/entities/user.entity';
import { ICryptoRepository } from 'src/interfaces/crypto.interface';
import { IUserRepository } from 'src/interfaces/user.interface';

let instance: UserCore | null;

export class UserCore {
    private constructor(
        private userRepository: IUserRepository,
        private cryptoRepository: ICryptoRepository,
    ) {}

    static create(userRepository: IUserRepository, cryptoRepository: ICryptoRepository) {
        if (!instance) {
            instance = new UserCore(userRepository, cryptoRepository);
        }

        return instance;
    }

    static reset() {
        instance = null;
    }

    async createUser(dto: Partial<UserEntity> & { email: string }): Promise<UserEntity> {
        const user = await this.userRepository.getByEmail(dto.email);
        if (user) {
            throw new BadRequestException('User exists');
        }

        const payload: Partial<UserEntity> = { ...dto };
        if (payload.password) {
            payload.password = await this.cryptoRepository.hashBcrypt(payload.password, SALT_ROUNDS);
        }

        const userEntity = await this.userRepository.create(payload);
        return userEntity;
    }
}
