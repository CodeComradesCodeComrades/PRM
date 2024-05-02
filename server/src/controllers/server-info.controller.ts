import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServerConfigDto } from 'src/dto/server-info.dto';
import { Authenticated, PublicRoute } from 'src/middlewares/auth.guard';
import { ServerInfoService } from 'src/services/server-info.service';

@ApiTags('Server Info')
@Controller('server-info')
@Authenticated()
export class ServerInfoController {
    constructor(private service: ServerInfoService) {}

    @PublicRoute()
    @Get('config')
    @ApiOkResponse({
        type: ServerConfigDto,
    })
    getServerConfig(): Promise<ServerConfigDto> {
        return this.service.getConfig();
    }
}
