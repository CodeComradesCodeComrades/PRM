import { ICryptoRepository } from 'src/interfaces/crypto.interface';
import { IDatabaseRepository } from 'src/interfaces/database.interface';
import { IDiaryRepository } from 'src/interfaces/diary.interface';
import { ISessionRepository } from 'src/interfaces/session.interface';
import { IUserRepository } from 'src/interfaces/user.interface';
import { CryptoRepository } from 'src/repositories/cryptoRepository.repository';
import { DatabaseRepository } from 'src/repositories/database.repository';
import { DiaryRepository } from 'src/repositories/diary.repository';
import { SessionRepository } from 'src/repositories/session.repository';
import { UserRepository } from 'src/repositories/user.repository';

export const repositories = [
    { provide: ICryptoRepository, useClass: CryptoRepository },
    { provide: IDatabaseRepository, useClass: DatabaseRepository },
    { provide: IUserRepository, useClass: UserRepository },
    { provide: ISessionRepository, useClass: SessionRepository },
    { provide: IDiaryRepository, useClass: DiaryRepository },
];
