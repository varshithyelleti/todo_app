import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsEmail, Length, Matches, IsEnum, IsOptional } from 'class-validator';
import { Task } from 'src/task/task.entity';
import { Exclude } from 'class-transformer';

export enum GENDER_TYPE {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()  
  @Length(3, 100)  
  name: string;

  @Column()
  @Matches(/^[0-9]{10}$/)  
  mobileNumber: string;

  @Column()
  @IsEnum(GENDER_TYPE)  
  gender: GENDER_TYPE;

  @Column()
  @IsString()
  @Length(3, 100)
  country: string;

  @Column()
  @IsString()
  @IsOptional() 
  @Length(3, 100) 
  hobbies: string;

  @Column()
  @IsEmail()  
  email: string;

  @Column()
  @IsString()  
  @Exclude()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];
}
