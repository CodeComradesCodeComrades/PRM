import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from 'src/entities/sessions.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ISessionRepository } from 'src/interfaces/session.interface';
import { IUserRepository } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository implements ISessionRepository {
    constructor(@InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>) {}

    async getByToken(token: string): Promise<SessionEntity | null> {
        return this.sessionRepository.findOne({ where: { token }, relations: { user: true } });
    }

    async create(user: Partial<SessionEntity>): Promise<SessionEntity> {
        return this.save(user);
    }

    async save(user: Partial<SessionEntity>) {
        const { id } = await this.sessionRepository.save(user);
        return this.sessionRepository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(id: string): Promise<void> {
        await this.sessionRepository.delete({ id });
    }
}
