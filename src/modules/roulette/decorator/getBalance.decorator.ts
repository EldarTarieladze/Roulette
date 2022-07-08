import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { jwtBalance } from '../types/jwt.type';

export const GetCurrentUserBalnace = createParamDecorator(
  (data: keyof jwtBalance | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
