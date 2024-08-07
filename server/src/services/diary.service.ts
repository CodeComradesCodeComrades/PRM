import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto/auth.dto';
import { DiaryCreateDto, DiaryEditDto, DiaryResponseDto, mapDiary } from 'src/dto/diary.dto';
import { IDiaryRepository } from 'src/interfaces/diary.interface';

@Injectable()
export class DiaryService {
    constructor(@Inject(IDiaryRepository) private diaryRepository: IDiaryRepository) {}

    async create(auth: AuthDto, dto: DiaryCreateDto): Promise<DiaryResponseDto> {
        let diary = await this.diaryRepository.getByDateAndUser(dto.date, auth.user);
        if (diary) throw new BadRequestException('Diary entry already exists');

        return this.diaryRepository.create({ ...dto, user: auth.user }).then(mapDiary);
    }

    async delete(auth: AuthDto, date: string): Promise<void> {
        let diary = await this.diaryRepository.getByDateAndUser(date, auth.user);
        if (!diary) throw new BadRequestException('Diary not found');

        return this.diaryRepository.delete(diary.id);
    }

    async edit(auth: AuthDto, date: string, dto: DiaryEditDto) {
        let diary = await this.diaryRepository.getByDateAndUser(date, auth.user);
        if (!diary) throw new BadRequestException('Diary not found');

        const originalDiary = { ...diary };
        let changesDetected = false;

        for (const key in dto) {
            if (originalDiary[key] !== dto[key]) {
                changesDetected = true;
                break;
            }
        }

        if (!changesDetected) throw new BadRequestException('no changes made')
        diary = await this.diaryRepository.update({ id: diary.id, ...dto });

        return mapDiary(diary);
    }

    async get(auth: AuthDto, date: string) {
        let diary = await this.diaryRepository.getByDateAndUser(date, auth.user);
        if (!diary) throw new BadRequestException('Diary not found');

        return mapDiary(diary);
    }

    async getAll(auth: AuthDto) {
        const diaries = await this.diaryRepository.getByUserId(auth.user.id);

        return {
            diaries: diaries.map((diary) => mapDiary(diary)),
        };
    }
}