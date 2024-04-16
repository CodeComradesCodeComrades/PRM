import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private service: UserService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.service.create(createUserDto);
    }
}
