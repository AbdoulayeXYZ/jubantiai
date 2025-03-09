import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateValidatedByColumn1709999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column exists
        const [columns] = await queryRunner.query(
            `SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = 'jubantiai_db' 
             AND TABLE_NAME = 'grades' 
             AND COLUMN_NAME = 'validatedBy'`
        );

        if (!columns) {
            // Add the column if it doesn't exist
            await queryRunner.query(`ALTER TABLE grades ADD COLUMN validatedBy int NULL`);
        } else {
            // Drop the foreign key constraint if it exists
            await queryRunner.query(`ALTER TABLE grades DROP FOREIGN KEY IF EXISTS FK_grades_validatedBy_users`);
            // Modify the existing column
            await queryRunner.query(`ALTER TABLE grades MODIFY COLUMN validatedBy int NULL`);
        }

        // Add the foreign key constraint
        await queryRunner.query(
            `ALTER TABLE grades ADD CONSTRAINT FK_grades_validatedBy_users 
             FOREIGN KEY (validatedBy) REFERENCES users(id) ON DELETE SET NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`ALTER TABLE grades DROP FOREIGN KEY IF EXISTS FK_grades_validatedBy_users`);
        
        // Drop the column
        await queryRunner.query(`ALTER TABLE grades DROP COLUMN validatedBy`);
    }
} 