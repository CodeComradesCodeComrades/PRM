import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SessionEntity } from 'src/entities/sessions.entity';
import { UserEntity } from 'src/entities/user.entity';
import { toEmail } from 'src/validation';

export class AuthCredentialDto {
    @IsEmail()
    @ApiProperty({ example: 'testuser@email.com' })
    @IsNotEmpty()
    @Transform(toEmail)
    email!: string;

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
