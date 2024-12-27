import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserRequestBodyDto } from './dto/UserRequestBodyDTO';
import { UserResponseDto } from './dto/UserResponseDto';
import { UserService } from './user.service';
import { ResponseService } from 'src/common/response.service';
import { ResponseDto } from 'src/common/responseDto';

@Controller("/api/v1/auth")
export class UserController {

    constructor(private userService: UserService, private responseService: ResponseService) {}
    
    @Post("signup")
    async createUser(@Body() userRequestBodyDto: UserRequestBodyDto): Promise<ResponseDto> {
        const userDetails = await this.userService.createUser(userRequestBodyDto);
        return this.responseService.createResponse(HttpStatus.CREATED, 'User registered successfully', userDetails);
    }

    @Post("signin")
    async signInUser(@Body() userRequestBodyDto: UserRequestBodyDto): Promise<ResponseDto> {
        const userDetails = await this.userService.signInUser(userRequestBodyDto);
        return this.responseService.createResponse(HttpStatus.OK, 'User signed in successfully', userDetails);
    }

}
