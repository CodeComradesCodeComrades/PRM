import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto/auth.dto';
import { DiaryCreateDto, DiaryEditDto, DiaryResponseDto, mapDiary } from 'src/dto/diary.dto';
import { IDiaryRepository } from 'src/interfaces/diary.interface';

@Injectable()
export class DiaryService {
    constructor(@Inject(IDiaryRepository) private diaryRepository: IDiaryRepository) {}

    async create(auth: AuthDto, dto: DiaryCreateDto): Promise<DiaryResponseDto> {
        const diary = await this.diaryRepository.getByDateAndUser(dto.date, auth.user);
        if (diary) throw new BadRequestException('Diary entry already exists');

        return this.diaryRepository.create({ ...dto, user: auth.user }).then(mapDiary);
    }

    async delete(auth: AuthDto, date: string): Promise<void> {
        const diary = await this.diaryRepository.getByDateAndUser(date, auth.user);
        if (!diary) throw new BadRequestException('Diary not found');

        return this.diaryRepository.delete(diary.id);
    }

    async edit(auth: AuthDto, date: string, dto: DiaryEditDto) {
        const diary = await this.diaryRepository.getByDateAndUser(date, auth.user);
        if (!diary) throw new BadRequestException('Diary not found');

        return await this.diaryRepository.update({ id: diary.id, ...dto });
    }
}
