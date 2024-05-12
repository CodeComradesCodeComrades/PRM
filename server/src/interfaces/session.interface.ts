import { SessionEntity } from 'src/entities/sessions.entity';

export interface ISessionRepository {
    getByToken(userToken: string): Promise<SessionEntity | null>;
    create(user: Partial<SessionEntity>): Promise<SessionEntity>;
    save(user: Partial<SessionEntity>);
    delete(id: string): Promise<void>;
}

export interface LoginDetails {
    isSecure: boolean;
    clientIp: string;
}

export const ISessionRepository = 'ISessionRepository';
