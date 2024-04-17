import { compareSync, hash } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { ICryptoRepository } from 'src/interfaces/crypto.interface';

export class CryptoRepository implements ICryptoRepository {
    hashBcrypt(data: string | Buffer, saltOrRounds: string | number) {
        return hash(data, saltOrRounds);
    }

    compareBcrypt(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }

    randomSessionKey(bytes: number): string {
        return randomBytes(bytes).toString('base64').replaceAll(/\W/g, '');
    }

    hashSha256(input: string | Buffer) {
        return createHash('sha256').update(input).digest('base64');
    }
}
