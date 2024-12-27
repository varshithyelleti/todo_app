import { IsDate, IsEnum, IsString, Length } from "class-validator";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TASK_STATUS {
    IN_PROGRESS = "IN_PROGRESS",
    TODO = "TODO",
    DONE = "DONE",
  }

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'Untitled Task' })
    @IsString()
    @Length(3, 150)
    title: string;

    @Column({ nullable: true })
    @IsString()
    @Length(3, 250)
    description: string;

    @Column({default: TASK_STATUS.TODO})
    @IsEnum(TASK_STATUS)  
    status: TASK_STATUS;

    @Column({ nullable: true })
    @IsDate()
    startDateTime: Date;

    @Column({ nullable: true })
    @IsDate()
    endDateTime: Date;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false, onDelete: "CASCADE" })
    user: User;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}