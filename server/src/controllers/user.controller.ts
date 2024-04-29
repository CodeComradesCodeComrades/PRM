import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private service: UserService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.service.create(createUserDto);
    }
}
