import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/redis/redis.module';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roulette.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    RouletteModule,
    RedisModule,
  ],
  controllers: [RouletteController],
  providers: [RouletteService, JwtStrategy],
})
export class RouletteModule {}
