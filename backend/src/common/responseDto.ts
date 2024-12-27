import { HttpStatus } from "@nestjs/common";

export class ResponseDto{
    status: HttpStatus;
    message: string;
    data?: any;
  
    constructor(statusCode: HttpStatus, message: string, data?: any) {
      this.status = statusCode;
      this.message = message;
      this.data = data;
    }
}