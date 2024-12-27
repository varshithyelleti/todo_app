import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { UserService } from 'src/user/user.service';
import { TaskRequestBodyDto } from './dto/TaskRequestBodyDto';
import { TASK_STATUS } from './task.entity';
import { ResponseDto } from 'src/common/responseDto';
import { ResponseService } from 'src/common/response.service';

@Controller('/api/v1')
export class TaskController {
    constructor(private readonly taskService: TaskService, private readonly userService: UserService, private readonly responseService: ResponseService) {}
    
    @Get("/tasks")
    async getAllTasks(@Query('search') search?: string, @Query('status') status?: TASK_STATUS, @Query('page') page: number = 1, @Query('size') size: number = 10): Promise<ResponseDto> {
        const user = await this.userService.getAuthToken();
        if(!user) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        const userId = user.userId;
        return this.taskService.getAllTasks(userId, search, status, page, size);
    }  

    @Post("/task")
    async createTask(@Body() taskRequestBody: TaskRequestBodyDto): Promise<ResponseDto> {
        const user = await this.userService.getAuthToken();
        if(!user) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        const userId = user.userId;
        return this.taskService.createTask(taskRequestBody, userId);
    }

    @Put("/task/:id")
    async updateTask(@Param('id') taskId: number, @Body() taskRequestBody: TaskRequestBodyDto) : Promise<ResponseDto> {
        const user = await this.userService.getAuthToken();
        if(!user) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        const userId = user.userId;
        return this.taskService.updateTask(taskId, taskRequestBody, userId);
    }

    @Delete("/task/:id")
    async deleteTask(@Param('id') taskId: number): Promise<ResponseDto> { 
        const user = await this.userService.getAuthToken();
        if(!user) {
            return this.responseService.createResponse(HttpStatus.NOT_FOUND, 'User not found', null );
        }
        const userId = user.userId;
        return this.taskService.deleteTask(taskId, userId);
    }
    

}
