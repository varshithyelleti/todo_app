import { DataSource, In, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {

    private repository: Repository<User>;

    constructor(private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(User);
    }
    

    async upsertUser(user: User): Promise<User> { 
        return this.repository.save(user);
    }

    async findByCriteria(mobileNumber: string, email: string): Promise<User | undefined> {
        return this.repository.findOne({where: [{mobileNumber}, {email}]});
    }

    async findById(id: number): Promise<User | undefined> {
        return this.repository.findOne({where: [{id}]});
    }

    async findByMobileNumber(mobileNumber: string): Promise<User | undefined> {
        return this.repository.findOne({where: [{mobileNumber}]});
    }
}