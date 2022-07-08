import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SessionExist implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    // ignore ts from access session.account
    if (!req.session.account) {
      throw new BadRequestException('No session registered');
    }
    next();
  }
}
