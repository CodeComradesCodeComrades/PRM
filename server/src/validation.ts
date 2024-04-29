import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

type IValue = { value: string };

export const toEmail = ({ value }: IValue) => value?.toLowerCase();

export class UUIDParamDto {
    @IsNotEmpty()
    @IsUUID('4')
    @ApiProperty({ format: 'uuid' })
    id!: string;
}

export class DateParamDto {
    @IsDateString({
        strict: true,
    })
    @IsNotEmpty()
    @ApiProperty({ format: 'date' })
    date: string;
}
