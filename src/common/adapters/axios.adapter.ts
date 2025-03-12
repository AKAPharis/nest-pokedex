import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { CATCH_WATERMARK } from '@nestjs/common/constants';
import { InternalServerErrorException } from '@nestjs/common';
export class AxiosAdapter implements HttpAdapter {
  private readonly axiosProvider: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try{
        const {data} = await this.axiosProvider.get<T>(url);
        return data;
    }catch(error){
        throw new InternalServerErrorException('Error fetching');
    }
  }
}
