import { hash } from 'bcrypt';
import { ICryptoRepository } from 'src/interfaces/crypto.interface';

export class CryptoRepository implements ICryptoRepository {
  hashBcrypt(data: string | Buffer, saltOrRounds: string | number) {
    return hash(data, saltOrRounds);
  }
}
