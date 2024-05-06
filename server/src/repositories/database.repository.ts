import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import AsyncLock from 'async-lock';
import { DatabaseLock, IDatabaseRepository } from 'src/interfaces/database.interface';
import { PRMLogger } from 'src/utils/logger';
import { Version } from 'src/utils/version';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class DatabaseRepository implements IDatabaseRepository {
    private logger = new PRMLogger(DatabaseRepository.name);
    readonly asyncLock = new AsyncLock();

    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async getPostgresVersion(): Promise<Version> {
        const res = await this.dataSource.query(`SHOW server_version`);
        return Version.fromString(res[0]['server_version']);
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<void> {
        await this.dataSource.runMigrations(options);
    }

    async withLock<R>(lock: DatabaseLock, callback: () => Promise<R>): Promise<R> {
        let res;
        await this.asyncLock.acquire(DatabaseLock[lock], async () => {
            const queryRunner = this.dataSource.createQueryRunner();
            try {
                await this.acquireLock(lock, queryRunner);
                res = await callback();
            } finally {
                try {
                    await this.releaseLock(lock, queryRunner);
                } finally {
                    await queryRunner.release();
                }
            }
        });

        return res as R;
    }

    async tryLock(lock: DatabaseLock): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        return await this.acquireTryLock(lock, queryRunner);
    }

    isBusy(lock: DatabaseLock): boolean {
        return this.asyncLock.isBusy(DatabaseLock[lock]);
    }

    async wait(lock: DatabaseLock): Promise<void> {
        await this.asyncLock.acquire(DatabaseLock[lock], () => {});
    }

    private async acquireLock(lock: DatabaseLock, queryRunner: QueryRunner): Promise<void> {
        return queryRunner.query('SELECT pg_advisory_lock($1)', [lock]);
    }

    private async acquireTryLock(lock: DatabaseLock, queryRunner: QueryRunner): Promise<boolean> {
        const lockResult = await queryRunner.query('SELECT pg_try_advisory_lock($1)', [lock]);
        return lockResult[0].pg_try_advisory_lock;
    }

    private async releaseLock(lock: DatabaseLock, queryRunner: QueryRunner): Promise<void> {
        return queryRunner.query('SELECT pg_advisory_unlock($1)', [lock]);
    }
}
