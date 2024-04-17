import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';
import { toEmail } from 'src/validation';

export class CreateUserDto {
    @IsEmail({ require_tld: true })
    @Transform(toEmail)
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsString()
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
