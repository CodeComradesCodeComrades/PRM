import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/entities/diary.entity';
import { UserEntity } from 'src/entities/user.entity';
import { IDiaryRepository } from 'src/interfaces/diary.interface';
import { Repository } from 'typeorm';

@Injectable()
export class DiaryRepository implements IDiaryRepository {
    constructor(@InjectRepository(DiaryEntity) private diaryRepository: Repository<DiaryEntity>) {}

    async getByDateAndUser(date: string, user: UserEntity): Promise<DiaryEntity> {
        const diary = this.diaryRepository.findOne({
            where: {
                date: date,
                userId: user.id,
            },
        });
        return diary;
    }

    async getByUserId(userId: string) {
        return this.diaryRepository.find({
            where: {
                userId: userId,
            },
        });
    }

    async create(user: Partial<DiaryEntity>): Promise<DiaryEntity> {
        return this.diaryRepository.save(user);
    }

    async update(diary: Partial<DiaryEntity>): Promise<DiaryEntity> {
        const { id, updatedAt, ...updatedFields } = diary; // Exclude updatedAt from updates

        if (Object.keys(updatedFields).length === 0) {
            return this.diaryRepository.findOneOrFail({ where: { id } });
        }

        await this.diaryRepository.update(diary.id, updatedFields);

        return this.diaryRepository.findOneOrFail({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        await this.diaryRepository.delete({ id });
    }

    private async save(user: Partial<DiaryEntity>) {
        const { id } = await this.diaryRepository.save(user);
        return this.diaryRepository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}