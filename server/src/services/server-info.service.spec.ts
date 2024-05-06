import { Test, TestingModule } from '@nestjs/testing';
import { ServerInfoService } from './server-info.service';

describe('ServerInfoService', () => {
    let service: ServerInfoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ServerInfoService],
        }).compile();

        service = module.get<ServerInfoService>(ServerInfoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
