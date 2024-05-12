import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDiaryTable1713453941203 implements MigrationInterface {
    name = 'CreateDiaryTable1713453941203';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "diary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "date" date NOT NULL DEFAULT ('now'::text)::date, "content" character varying NOT NULL, "rating" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "encryption" character varying NOT NULL DEFAULT 'none', CONSTRAINT "UQ_59d4bab35be53d97befa932ab3f" UNIQUE ("userId", "date"), CONSTRAINT "PK_7422c55a0908c4271ff1918437d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "diary" ADD CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c"`);
        await queryRunner.query(`DROP TABLE "diary"`);
    }
}
