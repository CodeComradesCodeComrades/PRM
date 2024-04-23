import { Type } from 'class-transformer';
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
import { DateTime } from 'luxon';
import { DiaryEncryption, DiaryEntity } from 'src/entities/diary.entity';

export class DiaryCreateDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDateString({
        strict: true,
    })
    @IsOptional()
    date: string;

    @IsInt()
    @Min(1)
    @Max(10)
    @IsOptional()
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
    content: string;

    @IsInt()
    @Min(1)
    @Max(10)
    @ValidateIf((o) => !o.content || o.rating)
    rating: number;
}
