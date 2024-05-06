import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameFieldToUser1714573446620 implements MigrationInterface {
    name = 'AddUsernameFieldToUser1714573446620';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }
}
