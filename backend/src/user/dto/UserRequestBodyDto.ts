import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from "class-validator";
import { GENDER_TYPE } from "../user.entity";

export class UserRequestBodyDto {
    @IsString()
    @Length(3, 100)
    name: string;
  
    @Matches(/^[0-9]{10}$/)
    mobileNumber: string;
  
    @IsEnum(GENDER_TYPE)
    gender: GENDER_TYPE;
  
    @IsString()
    @Length(3, 100)
    @IsOptional()
    country: string;
  
    @IsString()
    @Length(3, 100)
    @IsOptional()
    hobbies: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
}