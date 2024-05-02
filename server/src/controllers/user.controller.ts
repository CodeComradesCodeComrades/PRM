import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from 'src/dto/auth.dto';
import { UserResponseDto } from 'src/dto/user.dto';
import { Auth, Authenticated } from 'src/middlewares/auth.guard';
import { UserService } from 'src/services/user.service';

@ApiTags('User')
@Controller('user')
@Authenticated()
export class UserController {
    constructor(private service: UserService) {}

    @Get('me')
    @ApiOkResponse({
        type: UserResponseDto,
    })
    getMyUser(@Auth() authDto: AuthDto): Promise<UserResponseDto> {
        return this.service.getMe(authDto);
    }
}
