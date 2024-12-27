import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.respository';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ResponseService } from 'src/common/response.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Task]),
      ConfigModule,
      UserModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecret', 
        signOptions: { expiresIn: '100h' },
      }),
  ],
  providers: [TaskService, TaskRepository, ResponseService],
  controllers: [TaskController]
})
export class TaskModule {}
