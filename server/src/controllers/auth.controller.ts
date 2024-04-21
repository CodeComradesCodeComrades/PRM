import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ACCESS_COOKIE } from 'src/constants';
import { AuthCredentialDto, AuthDto, LoginResponseDto } from 'src/dto/auth.dto';
import { LoginDetails } from 'src/interfaces/session.interface';
import { Auth, Authenticated, GetLoginDetails, PublicRoute } from 'src/middlewares/auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@Authenticated()
export class AuthController {
    constructor(private service: AuthService) {}

    @PublicRoute()
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

    @Post('logout')
    async logout(
        @Auth() authDto: AuthDto,
        @Res({
            passthrough: true,
        })
        res: Response,
    ) {
        res.clearCookie(ACCESS_COOKIE);
        return this.service.logout(authDto);
    }
}
