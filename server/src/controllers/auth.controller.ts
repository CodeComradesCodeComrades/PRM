import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthCredentialDto, LoginResponseDto } from 'src/dto/auth.dto';
import { LoginDetails } from 'src/interfaces/session.interface';
import { GetLoginDetails } from 'src/middlewares/auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('login')
    async login(
        @Body() credentials: AuthCredentialDto,
        @Res({
            passthrough: true,
        })
        res: Response,
        @GetLoginDetails() loginDetails: LoginDetails,
    ): Promise<LoginResponseDto> {
        const { response, cookie } = await this.service.login(credentials, loginDetails);
        res.header('Set-Cookie', cookie);
        return response;
    }
}
