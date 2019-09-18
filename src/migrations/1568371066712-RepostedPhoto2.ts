import {  MigrationInterface, QueryRunner } from 'typeorm';

export class RepostedPhoto21568371066712 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "public"."reposted_photo" ADD "voted" integer array  DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "string" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "boolean" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "integer" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "float" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "datetime" SET DEFAULT null`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "datetime" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "float" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "integer" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "boolean" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."config" ALTER COLUMN "string" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."reposted_photo" DROP COLUMN "voted"`);
  }

}
