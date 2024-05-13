import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDiaryRatingMinAndType1715629091268 implements MigrationInterface {
    name = 'ChangeDiaryRatingMinAndType1715629091268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "diary" ADD "rating" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "diary" ADD "rating" integer`);
    }

}
