import { UserEntity } from 'src/entities/user.entity';

export interface IUserRepository {
    get(id: string): Promise<UserEntity | null>;
    getByEmail(email: string, withPassword?: boolean): Promise<UserEntity | null>;
    getByName(name: string, withPassword?: boolean): Promise<UserEntity | null>;
    create(user: Partial<UserEntity>): Promise<UserEntity>;
    getAdmin(): Promise<UserEntity | null>;
}

export const IUserRepository = 'IUserRepository';
