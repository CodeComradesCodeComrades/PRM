import { Optional, applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsString, IsUUID, NotContains } from 'class-validator';
import { string } from 'joi';

type IValue = { value: string };

export const toEmail = ({ value }: IValue) => value?.toLowerCase();
export const toLowerCase = ({ value }: IValue) => value?.toLowerCase();

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

type EmailOptions = {
    apiProperty: boolean;
};
export const ValidateEmail = (options: EmailOptions = { apiProperty: true }) => {
    return applyDecorators(
        IsEmail({ require_tld: true }),
        Transform(toEmail),
        options.apiProperty ? ApiProperty({ type: 'string', example: 'test@example.com' }) : null,
    );
};

type PasswordOptions = {};
export const ValidatePassword = () => {
    return applyDecorators();
};

type UUIDOptions = { optional?: boolean; each?: boolean };
export const ValidateUUID = (options?: UUIDOptions) => {
    const { optional, each } = { optional: false, each: false, ...options };
    return applyDecorators(
        IsUUID('4', { each }),
        ApiProperty({ format: 'uuid' }),
        optional ? Optional() : IsNotEmpty(),
        each ? IsArray() : IsString(),
    );
};

export const ValidateUsername = () => {
    return applyDecorators(ApiProperty({ format: 'username' }), IsNotEmpty(), IsString(), NotContains(' '));
};
