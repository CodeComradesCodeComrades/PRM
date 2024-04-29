import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDate,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { string } from 'joi';
import { DateTime } from 'luxon';
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
}

export function mapDiary(entity: DiaryEntity): DiaryResponseDto {
    return {
        id: entity.id,
        date: entity.date,
        encryption: entity.encryption,
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
