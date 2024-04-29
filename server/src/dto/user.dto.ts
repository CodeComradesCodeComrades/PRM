import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, NotContains } from 'class-validator';
import { string } from 'joi';
import { UserEntity } from 'src/entities/user.entity';
import { toEmail } from 'src/validation';

export class CreateUserDto {
    @ApiProperty({ type: string, example: 'test@example.com' })
    @IsEmail({ require_tld: true })
    @Transform(toEmail)
    email!: string;

    @ApiProperty({ type: string, example: 'thispasswordisnotsafe' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ type: string, example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    @NotContains(' ')
    name!: string;
}

export class UserDto {
    id!: string;
    name!: string;
    email!: string;
}
export class UserResponseDto extends UserDto {}

export const mapSimpleUser = (entity: UserEntity): UserDto => {
    return {
        id: entity.id,
        email: entity.email,
        name: entity.name,
    };
};

export function mapUser(entity: UserEntity): UserResponseDto {
    return {
        ...mapSimpleUser(entity),
    };
}
