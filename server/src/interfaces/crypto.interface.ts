export interface ICryptoRepository {
    hashBcrypt(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
}

export const ICryptoRepository = 'ICryptoRepository';
