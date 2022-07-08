import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: Redis.createClient({ url: 'redis://localhost:6379' }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
