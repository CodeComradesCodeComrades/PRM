import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from 'src/dto/auth.dto';
import { DiaryCreateDto, DiaryEditDto, DiaryResponseDto } from 'src/dto/diary.dto';
import { Auth, Authenticated } from 'src/middlewares/auth.guard';
import { DiaryService } from 'src/services/diary.service';
import { DateParamDto, UUIDParamDto } from 'src/validation';

@ApiTags('Diary')
@Controller('diary')
@Authenticated()
export class DiaryController {
    constructor(private service: DiaryService) {}

    @Post()
    async create(@Auth() auth: AuthDto, @Body() createDto: DiaryCreateDto): Promise<DiaryResponseDto> {
        return this.service.create(auth, createDto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':date')
    async deleteByDate(@Auth() auth: AuthDto, @Param() { date }: DateParamDto) {
        return this.service.delete(auth, date);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':date')
    async editDiary(@Auth() auth: AuthDto, @Param() { date }: DateParamDto, @Body() editDto: DiaryEditDto) {
        return this.service.edit(auth, date, editDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':date')
    async getDiary(@Auth() auth: AuthDto, @Param() { date }: DateParamDto) {
        return this.service.get(auth, date);
    }

    @Get()
    async getAllDiaries(@Auth() auth: AuthDto) {
        return this.service.getAll(auth);
    }
}
