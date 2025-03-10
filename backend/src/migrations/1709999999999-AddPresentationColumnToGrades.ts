import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPresentationColumnToGrades1709999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("grades", new TableColumn({
            name: "presentation",
            type: "int",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("grades", "presentation");
    }
}
