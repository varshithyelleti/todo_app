
import { replaceUrlParams } from "../utils/helper";
import { API_METHOD, GENDER_TYPE, TASK_STATUS } from "../utils/type";
import {request} from './index';

export interface CreateTaskDetails {
    title: string;
    description: string;
    status: TASK_STATUS;
    startDateTime?: Date | string;
    endDataTime?: Date | string;
}

export const TASK_URLS = {
    GET_ALL: "/tasks",
    CREATE: "/task",
    DELETE: "/task/:id",
    UPDATE: "/task/:id"
}

export interface QueryParams {
    search?: string;
    page?: number;
    size?: number;  
    status?: TASK_STATUS;
}

export const useTaskService = () => {

    const getAllTasks = ( params?:QueryParams ) => {
        return request(API_METHOD.GET, TASK_URLS.GET_ALL, null, null, { params: params || {} });
    }

    const createTask = ( data: CreateTaskDetails ) => {
        return request(API_METHOD.POST, TASK_URLS.CREATE, null, data);
    }

    const updateTask = ( id: number, data: CreateTaskDetails ) => {
        return request(API_METHOD.PUT,  replaceUrlParams(TASK_URLS.UPDATE, { id } ), null, data);
    }

    const deleteTask = ( id: number ) => {
        return request(API_METHOD.DELETE, replaceUrlParams(TASK_URLS.DELETE, { id } ), null, null);
    }

    return { getAllTasks, createTask, updateTask, deleteTask };
}