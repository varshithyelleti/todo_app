import { DataSource, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Task, TASK_STATUS } from "./task.entity";

@Injectable()
export class TaskRepository {

    private repository: Repository<Task>;

    constructor(private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(Task);
    }
    
    async upsertTask(user: Task): Promise<Task> { 
        return this.repository.save(user);
    }

    async findById(id: number): Promise<Task | undefined> {
        return this.repository.findOne({ 
            where: {id},
            relations: ['user']
        });
    }

    async findAll(userId: number, search?: string, status?: TASK_STATUS, page: number = 1, size: number = 10): Promise<Task[]> {
        const query = this.repository.createQueryBuilder('task') .where('task.userId = :userId', { userId });
        if(search) {
            query.andWhere('task.title like :search OR task.description like : search', {search: `%${search}%`});
        }
        if(status) {
            query.andWhere('task.status = :status', {status});
        }
        query.skip((page - 1) * size).take(size);
        return query.getMany(); 
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete(id);
    }

}