import { MigrationInterface, QueryRunner } from 'typeorm';

export class RepostedPhoto1568366363532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
CREATE TABLE "public"."reposted_photo" (
  "id" SERIAL NOT NULL,
  "enabled" boolean NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "fileId" character varying NOT NULL,
  "likes" integer NOT NULL,
  CONSTRAINT "PK_7b54c1c7e5968365de54d0d6434" PRIMARY KEY ("id")
)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "public"."reposted_photo"`);
  }
}
