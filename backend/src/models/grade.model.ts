import { AppDataSource } from '../configs/data-sources';
import { Grade } from '../entities/grade.entity';

export class GradeModel {
    private repository = AppDataSource.getRepository(Grade);

    async create(data: Partial<Grade>): Promise<Grade> {
        const grade = this.repository.create(data);
        return this.repository.save(grade);
    }

    async findBySubmissionId(submissionId: number): Promise<Grade[]> {
        return this.repository.find({
            where: { submissionId }
        });
    }
}
