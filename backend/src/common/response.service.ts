import { Injectable } from '@nestjs/common';
import { ResponseDto } from './responseDto';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {
  createResponse(statusCode: HttpStatus, message: string, data?: any ): ResponseDto {
    return new ResponseDto(statusCode, message, data);
  }
}