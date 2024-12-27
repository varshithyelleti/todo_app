import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserModel } from 'src/user/dto/UserModel';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationJwtMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!token) {
      return res.status(401).json({ message: 'Token not found in header' });
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new InternalServerErrorException('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, secret);

      const userId = decoded['userId'];
      const user = new UserModel(userId);
      await this.userService.setAuthToken(user);

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}