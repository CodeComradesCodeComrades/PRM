import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database.service';
import { PRMLogger } from 'src/utils/logger';

@Injectable()
export class ApiService {
    private logger = new PRMLogger(ApiService.name);

    constructor(private databaseService: DatabaseService) {}

    async init() {
        await this.databaseService.init();
    }
}
