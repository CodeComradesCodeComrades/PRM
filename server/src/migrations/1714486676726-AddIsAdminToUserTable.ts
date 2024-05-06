import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAdminToUserTable1714486676726 implements MigrationInterface {
    name = 'AddIsAdminToUserTable1714486676726';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }
}
