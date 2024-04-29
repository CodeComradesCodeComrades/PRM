import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { string } from 'joi';
import { SessionEntity } from 'src/entities/sessions.entity';
import { UserEntity } from 'src/entities/user.entity';
import { toEmail } from 'src/validation';

export class AuthCredentialDto {
    @IsEmail()
    @ApiProperty({ type: string, example: 'test@example.com' })
    @IsNotEmpty()
    @Transform(toEmail)
    @ValidateIf((o) => !o.name || o.email)
    email!: string;

    @ApiPropertyOptional()
    @ApiProperty({ example: 'testuser' })
    @IsNotEmpty()
    @ValidateIf((o) => !o.email || o.name)
    name!: string;

    @ApiProperty({ type: string, example: 'thispasswordisnotsafe' })
    @IsNotEmpty()
    @IsString()
    password!: string;
}

export class LoginResponseDto {
    accessToken!: string;
    userId!: string;
    userEmail!: string;
    name!: string;
}

export class LogoutResponseDto {
    loggedOut!: boolean;
}

export function mapLoginResponse(entity: UserEntity, accessToken: string): LoginResponseDto {
    return {
        accessToken: accessToken,
        userId: entity.id,
        userEmail: entity.email,
        name: entity.name,
    };
}

export class AuthDto {
    user!: UserEntity;

    userToken?: SessionEntity;
}
