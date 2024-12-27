import { IsDate, IsEnum, IsString, Length } from "class-validator";
import { TASK_STATUS } from "../task.entity";

export class TaskRequestBodyDto {

    @IsString()
    @Length(3, 100)
    title: string;

    @IsString()
    @Length(3, 250)
    description: string;

    @IsEnum(TASK_STATUS)  
    status: TASK_STATUS;

    @IsDate()
    startDateTime: Date;

    @IsDate()
    endDateTime: Date;
}   