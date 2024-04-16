import { UserEntity } from 'src/entities/user.entity';

export interface IUserRepository {
    get(id: string): Promise<UserEntity | null>;
    getByEmail(email: string): Promise<UserEntity | null>;
    create(user: Partial<UserEntity>): Promise<UserEntity>;
}

export const IUserRepository = 'IUserRepository';
