import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChecksumToDiary1719742554506 implements MigrationInterface {
    name = 'AddChecksumToDiary1719742554506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" ADD "checksum" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "checksum"`);
    }

}
