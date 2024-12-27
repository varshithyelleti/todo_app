import { HttpStatus, Injectable } from '@nestjs/common';
import { Task, TASK_STATUS } from './task.entity';
import { TaskRepository } from './task.respository';
import { TaskRequestBodyDto } from './dto/TaskRequestBodyDto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ResponseService } from 'src/common/response.service';
import { ResponseDto } from 'src/common/responseDto';

@Injectable()
export class TaskService {

    constructor(private readonly taskRepository: TaskRepository, private readonly userService: UserService, private readonly responseService: ResponseService) {}

    async createTask(taskRequestBody: TaskRequestBodyDto, userId: number): Promise<ResponseDto> {
        const user = await this.userService.getUserById(userId);
        if(!user) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        let taskEntity = plainToClass(Task, taskRequestBody);
        taskEntity = {...taskEntity, ...taskRequestBody, user: user};
        const savedTask =  this.taskRepository.upsertTask(taskEntity);
        return this.responseService.createResponse(HttpStatus.CREATED, 'Task created successfully', savedTask);
    }

    async updateTask(taskId: number, taskRequestBody: TaskRequestBodyDto, userId: number): Promise<ResponseDto> {
        let task = await this.taskRepository.findById(taskId);
        if(!task) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        if(task.user.id !== userId) {
            throw new Error("You are not authorized to update this task")
        }
        task = {...task, ...taskRequestBody}
        const updatedTask = this.taskRepository.upsertTask(task);
        return this.responseService.createResponse(HttpStatus.OK, 'Task updated successfully', updatedTask);

    }

    async deleteTask(id:number, userId: number): Promise<ResponseDto> {
        const task = await this.taskRepository.findById(id);
        if(task.user.id !== userId) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        this.taskRepository.deleteById(id); 
        return this.responseService.createResponse(HttpStatus.OK, 'Task deleted', id);
    }

    async getAllTasks(userId: number, search?: string, status?: TASK_STATUS, page: number = 1, size: number = 10): Promise<ResponseDto> {
        const tasks =  await this.taskRepository.findAll(userId, search, status, page, size);
        return this.responseService.createResponse(HttpStatus.OK, 'Tasks fetched successfully', tasks);
    }       
}
