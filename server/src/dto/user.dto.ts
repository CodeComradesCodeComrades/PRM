import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, NotContains } from 'class-validator';
import { string } from 'joi';
import { UserEntity } from 'src/entities/user.entity';
import { ValidateEmail, ValidateUUID, ValidateUsername, toEmail, toLowerCase } from 'src/validation';

export class CreateUserDto {
    @ValidateEmail()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    password!: string;

    @ValidateUsername()
    username: string;

    @ApiProperty({ type: string, example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    name!: string;
}

export class UserDto {
    @ValidateUUID()
    id!: string;
    @ApiProperty()
    name!: string;
    @ValidateEmail({
        apiProperty: true,
    })
    email!: string;
}
export class UserResponseDto extends UserDto {
    @ApiProperty()
    isAdmin!: boolean;
}

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
        isAdmin: entity.isAdmin,
    };
}
