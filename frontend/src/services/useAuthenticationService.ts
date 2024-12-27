
import { API_METHOD, GENDER_TYPE } from "../utils/type";
import {request} from './index';

export interface RegisterDetails {
    name: string;
    mobileNumber: string;
    gender: GENDER_TYPE;
    country?: string;
    hobbies?: string;
    email: string;
    password: string;
}

export interface LoginDetails {
    mobileNumber: string;
    password: string;
}   

export const AUTH_URLS = {
    LOGIN: "/auth/signin",
    REGISTER: "/auth/signup"
}

export const useAuthenticationService = () => {

    const register = (data: RegisterDetails) => {
        return request(API_METHOD.POST, AUTH_URLS.REGISTER, null, data);
    }

    const login = (data: LoginDetails) => {
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    }

    return { register, login };
}