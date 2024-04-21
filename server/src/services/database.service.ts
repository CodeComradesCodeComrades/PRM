import { Inject, Injectable } from '@nestjs/common';
import { DatabaseLock, IDatabaseRepository } from 'src/interfaces/database.interface';
import { PRMLogger } from 'src/utils/logger';

@Injectable()
export class DatabaseService {
    private logger = new PRMLogger(DatabaseService.name);
    minPostgresVersion = 14;

    constructor(@Inject(IDatabaseRepository) private databaseRepository: IDatabaseRepository) {}

    async init() {
        await this.assertPostgresql();
        await this.databaseRepository.withLock(DatabaseLock.Migrations, async () => {
            await this.databaseRepository.runMigrations();
        });
    }

    private async assertPostgresql() {
        const { major } = await this.databaseRepository.getPostgresVersion();
        if (major < this.minPostgresVersion) {
            throw new Error(`
        The PostgreSQL version is ${major}, which is older than the minimum supported version ${this.minPostgresVersion}.
        Please upgrade to this version or later.`);
        }
    }
}
