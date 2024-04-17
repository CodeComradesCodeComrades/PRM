import { UserEntity } from 'src/entities/user.entity';

export interface ICryptoRepository {
    hashBcrypt(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
    compareBcrypt(password: string, hash: string): boolean;
    randomSessionKey(bytes: number): string;
    hashSha256(input: string | Buffer);
}

export const ICryptoRepository = 'ICryptoRepository';
