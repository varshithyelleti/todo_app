import { Expose } from "class-transformer";
import { GENDER_TYPE, User } from "../user.entity";

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    mobileNumber: string; 

    @Expose()
    gender: GENDER_TYPE;

    @Expose()
    country: string;

    @Expose()
    hobbies: string;

    @Expose()
    email: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

}