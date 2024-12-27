import { ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRequestBodyDto } from './dto/UserRequestBodyDTO';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/UserResponseDto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserModel } from './dto/UserModel';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/responseDto';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class UserService {

    private userModel: UserModel | null = null;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly responseService: ResponseService
      ) {}

    async createUser(createUserDto: UserRequestBodyDto): Promise<{ user: UserResponseDto; token: string }> {
        const {mobileNumber, email, password} = createUserDto;
        const existingUser = await this.userRepository.findByCriteria(mobileNumber, email);
        if(existingUser) {
            throw new ConflictException('Mobile number or email already registered');
        }
        const hashedPassword = await this.generateHashPassword(password);
        const userEntity = plainToClass(User, createUserDto);
        userEntity.password = hashedPassword;
        try {
            const savedUser: User = await this.userRepository.upsertUser(userEntity);
            const token = await this.generateToken(savedUser);
            const userResponse =  plainToClass(UserResponseDto, savedUser);
            return {user: userResponse, token: token};
        } catch (error) {
            throw new InternalServerErrorException('Error while creating user');
        }
    }

    async signInUser(createUserDto: UserRequestBodyDto): Promise<{ user: UserResponseDto; token: string }> {
        const {mobileNumber, password} = createUserDto;
        const existingUser = await this.userRepository.findByMobileNumber(mobileNumber);
        if(!existingUser) {
           throw new ConflictException('User not found');
        }
        const inputHashPassword = await this.generateHashPassword(password);
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new ConflictException('Invalid password');
        }
        try {
            const token = await this.generateToken(existingUser);
            const userResponse =  plainToClass(UserResponseDto, existingUser);
            return {user: userResponse, token: token};
        } catch (error) {
            throw new InternalServerErrorException('Error while signing in, Please try again later');
        }

    }
    
    async setAuthToken(user: UserModel) {
        this.userModel = user;
    }

    async getAuthToken() {
        return this.userModel;
    }

    async generateToken(user: User) {
        const secret = this.configService.get<string>('JWT_SECRET');
        const tokenExpireIn = this.configService.get<string>('JWT_EXPIRATION_TIME');
        if (!secret) {
            throw new InternalServerErrorException('JWT_SECRET is not defined');
        }
        return this.jwtService.sign({ userId: user.id }, { secret, expiresIn: tokenExpireIn }); 
 }

    async generateHashPassword(password: string) {
        const salt = parseInt(this.configService.get<string>('HASH_SALT')) || 10;
        const saltRounds = await bcrypt.genSalt(salt); 
        return await bcrypt.hash(password, saltRounds);
    }

    async getUserById(userId: number): Promise<User> {
        return this.userRepository.findById(userId);
    }
}
