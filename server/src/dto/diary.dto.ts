import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
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

    @IsNumber()
    @Min(0.5)
    @Max(10)
    @ApiPropertyOptional({
        type: Number,
        minimum: 1,
        maximum: 10,
        example: 5,
    })
    rating: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', example: 'RSA' })
    encryption: DiaryEncryption;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', example: 'e0a533314daa3eb6d60807b1d6533fc96c886f19a813882331f27c42988dd165603b51d001aa5959037f63f19e51a18ab70702020c0aa89d'})
    checksum: string;
}

export class DiaryResponseDto {
    id: string;
    date: string;
    encryption: DiaryEncryption;
    content: string;
    rating: number;
    checksum: string;
}

export function mapDiary(entity: DiaryEntity): DiaryResponseDto {
    return {
        id: entity.id,
        date: entity.date,
        encryption: entity.encryption,
        content: entity.content,
        rating: entity.rating,
        checksum: entity.checksum,
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

    @IsNumber()
    @Min(0.5)
    @Max(10)
    @ValidateIf((o) => !o.content || o.rating)
    @ApiPropertyOptional({
        type: Number,
        minimum: 0.5,
        maximum: 10,
        example: 5,
    })
    rating: number;

    @IsDateString({
        strict: true,
    })
    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'date',
    })
    date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', example: 'RSA' })
    encryption: DiaryEncryption;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: 'string', example: 'e0a533314daa3eb6d60807b1d6533fc96c886f19a813882331f27c42988dd165603b51d001aa5959037f63f19e51a18ab70702020c0aa89d'})
    checksum: string;
}
