import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { gameMode } from './enum/gameMode.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.body.gameMode !== gameMode.NORMAL) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new BadRequestException('invalid token');
    }
    return user;
  }
}
