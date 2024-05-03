import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { string } from 'joi';
import { DiaryEncryption, DiaryEntity } from 'src/entities/diary.entity';

export class DiaryCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', example: 'Today...' })
    content: string;

    @IsDateString({
        strict: true,
    })
    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'date',
    })
    date: string;

    @IsInt()
    @Min(1)
    @Max(10)
    @IsOptional()
    @ApiPropertyOptional({
        type: Number,
        minimum: 1,
        maximum: 10,
        example: 5,
    })
    rating: number;
}

export class DiaryResponseDto {
    id: string;
    date: string;
    encryption: DiaryEncryption;
    content: string;
    rating: number;
}

export function mapDiary(entity: DiaryEntity): DiaryResponseDto {
    return {
        id: entity.id,
        date: entity.date,
        encryption: entity.encryption,
        content: entity.content,
        rating: entity.rating,
    };
}

export class DiaryEditDto {
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.rating || o.content)
    @ApiProperty({
        type: string,
        example: 'Today...',
    })
    content: string;

    @IsInt()
    @Min(1)
    @Max(10)
    @ValidateIf((o) => !o.content || o.rating)
    @ApiPropertyOptional({
        type: Number,
        minimum: 1,
        maximum: 10,
        example: 5,
    })
    rating: number;
}
