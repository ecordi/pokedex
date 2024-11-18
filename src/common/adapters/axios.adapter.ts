import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-interfase-adapter';
@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance =axios;

    async get<T>(url: string): Promise<T> {
    try {
       const {data}=await this.axios.get<T>(url);
       return data
    } catch (error) {
        console.log('Error >>>', error);
    } 
        
    }
}