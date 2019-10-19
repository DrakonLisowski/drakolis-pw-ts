import { MigrationInterface, QueryRunner } from 'typeorm';

export class Classic1565958151432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
    CREATE TABLE "public"."admin" (
      "id" SERIAL NOT NULL,
      "enabled" boolean NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "email" character varying NOT NULL,
      "passwordHash" character varying NOT NULL,
      CONSTRAINT "PK_f5901e2ac229607894f04c12148" PRIMARY KEY ("id")
    )`);
    await queryRunner.query(`
    CREATE TABLE "public"."config" (
      "id" SERIAL NOT NULL,
      "enabled" boolean NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "key" character varying NOT NULL,
      "string" character varying DEFAULT null,
      "boolean" boolean DEFAULT null,
      "integer" bigint DEFAULT null,
      "float" double precision DEFAULT null,
      "datetime" TIMESTAMP DEFAULT null,
      "private" boolean NOT NULL DEFAULT false,
      CONSTRAINT "UQ_cdf11bfcb8a728f63ae3d3d31d8" UNIQUE ("key"),
      CONSTRAINT "PK_7839f7dd8f45e37933fb3e35cbb" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "public"."config"`);
    await queryRunner.query(`DROP TABLE "public"."admin"`);
  }
}
