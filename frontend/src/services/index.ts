"use client";
import axios from 'axios';
import { AuthenticatedUserType } from '../contexts/AuthenticatedUserContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

const setAuthHeader = (): void => {
    const token = localStorage.getItem('user');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const request = async (
    method: string,
    url: string,
    userContext: AuthenticatedUserType | null,
    data?: any,
    options?: { params: { [key: string]: any } } | null,
    baseUrl = API_BASE_URL,
    headers?: { [key: string]: string }
): Promise<any> => {
    setAuthHeader();
    try {
        const response = await axios({
            method,
            baseURL: baseUrl,
            url,
            data,
            ...(options ? options : {}),
            headers,
        });
        return response;
    } catch (error) {
        throw error;
    }
};
