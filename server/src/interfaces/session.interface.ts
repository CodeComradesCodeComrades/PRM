import { SessionEntity } from 'src/entities/sessions.entity';
import { UserEntity } from 'src/entities/user.entity';

export interface ISessionRepository {
    getByToken(userToken: string): Promise<SessionEntity | null>;
    create(user: Partial<SessionEntity>): Promise<SessionEntity>;
    save(user: Partial<SessionEntity>);
}

export interface LoginDetails {
    isSecure: boolean;
    clientIp: string;
}

export const ISessionRepository = 'ISessionRepository';
