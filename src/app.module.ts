import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouletteModule } from './modules/roulette/roulette.module';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from 'redis';
import { RedisModule } from './redis/redis.module';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import { REDIS } from './redis/redis.constants';
import { SessionExist } from './modules/roulette/middleware/session.middleware';
import { RouletteController } from './modules/roulette/roulette.controller';

@Module({
  imports: [ConfigModule.forRoot(), RouletteModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
          }),
          saveUninitialized: false,
          secret: process.env.SESSION_SECRET,
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 6000000000000,
          },
        }),
      )
      .forRoutes('*');
    // check if session exist middleware form routes: "spin", "end", we don't need to check session exist in "create" route
    consumer
      .apply(SessionExist)
      .exclude({ path: 'api/roulette/create', method: RequestMethod.POST })
      .forRoutes(RouletteController);
  }
}
