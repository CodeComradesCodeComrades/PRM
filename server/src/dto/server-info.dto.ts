import { ApiProperty } from '@nestjs/swagger';

export class ServerConfigDto {
    @ApiProperty()
    isOnboarded!: boolean;
}
