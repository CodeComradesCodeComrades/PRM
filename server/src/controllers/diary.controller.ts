import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthDto } from 'src/dto/auth.dto';
import { DiaryCreateDto, DiaryEditDto, DiaryResponseDto } from 'src/dto/diary.dto';
import { Auth, Authenticated } from 'src/middlewares/auth.guard';
import { DiaryService } from 'src/services/diary.service';
import { DateParamDto, UUIDParamDto } from 'src/validation';

@Controller('diary')
@Authenticated()
export class DiaryController {
    constructor(private service: DiaryService) {}

    @Post()
    async create(@Auth() auth: AuthDto, @Body() createDto: DiaryCreateDto): Promise<DiaryResponseDto> {
        return this.service.create(auth, createDto);
    }

    @Delete(':date')
    async deleteByDate(@Auth() auth: AuthDto, @Param() { date }: DateParamDto) {
        return this.service.delete(auth, date);
    }

    @Patch(':date')
    async editDiary(@Auth() auth: AuthDto, @Param() { date }: DateParamDto, @Body() editDto: DiaryEditDto) {
        return this.service.edit(auth, date, editDto);
    }

    @Get(':date')
    async getDiary(@Auth() auth: AuthDto, @Param() { date }: DateParamDto) {
        return this.service.get(auth, date);
    }

    @Get()
    async getAllDiaries(@Auth() auth: AuthDto) {
        console.log(auth.user);
        return this.service.getAll(auth);
    }
}
