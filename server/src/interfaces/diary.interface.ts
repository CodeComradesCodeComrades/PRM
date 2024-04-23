import { AuthDto } from 'src/dto/auth.dto';
import { DiaryEntity } from 'src/entities/diary.entity';
import { UserEntity } from 'src/entities/user.entity';

export interface IDiaryRepository {
    getByDateAndUser(date: string, user: UserEntity): Promise<DiaryEntity | null>;
    getByUserId(user: UserEntity);
    create(user: Partial<DiaryEntity>): Promise<DiaryEntity>;
    update(diary: Partial<DiaryEntity>): Promise<DiaryEntity>;
    delete(id: string);
}

export const IDiaryRepository = 'IDiaryRepository';
