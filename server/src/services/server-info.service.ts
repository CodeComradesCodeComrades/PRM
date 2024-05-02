import { Inject, Injectable } from '@nestjs/common';
import { ServerConfigDto } from 'src/dto/server-info.dto';
import { ISystemMetadataRepository } from 'src/interfaces/system-metadata.interface';
import { IUserRepository } from 'src/interfaces/user.interface';

@Injectable()
export class ServerInfoService {
    constructor(@Inject(IUserRepository) private userRepository: IUserRepository) {}

    async getConfig(): Promise<ServerConfigDto> {
        const onboarding = await this.userRepository.getAdmin();

        return {
            isOnboarded: onboarding ? true : false,
        };
    }
}
