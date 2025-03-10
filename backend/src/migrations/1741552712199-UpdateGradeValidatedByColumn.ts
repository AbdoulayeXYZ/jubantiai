import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGradeValidatedByColumn1741552712199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE grades 
            ADD COLUMN key_concepts TEXT NULL,
            ADD COLUMN methodological_approach TEXT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE grades 
            DROP COLUMN key_concepts,
            DROP COLUMN methodological_approach
        `);
    }

}
