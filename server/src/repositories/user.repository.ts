import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { IUserRepository } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

    async get(userId: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        const user = this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        return user;
    }

    async create(user: Partial<UserEntity>): Promise<UserEntity> {
        return this.save(user);
    }

    update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        return this.save({ ...user, id });
    }

    private async save(user: Partial<UserEntity>) {
        const { id } = await this.userRepository.save(user);
        return this.userRepository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
