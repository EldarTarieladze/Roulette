import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Session as ExpressSession } from 'express-session';
import { GetCurrentUserBalnace } from './decorator/getBalance.decorator';
import { CreateSessionDto, SpinDto } from './dto/roulette.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RouletteService } from './roulette.service';
import { jwtBalance } from './types/jwt.type';

@Controller('roulette')
@ApiTags('Roulette')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createSession(
    @Body() dto: CreateSessionDto,
    @Session() session: ExpressSession,
    @GetCurrentUserBalnace() balance: jwtBalance,
  ) {
    return await this.rouletteService.createSession(dto, balance, session);
  }

  @Patch('spin')
  async spin(@Session() session: ExpressSession, @Body() dto: SpinDto) {
    return await this.rouletteService.spin(dto, session);
  }
  @Delete('end')
  async delete(@Session() session: ExpressSession) {
    return await this.rouletteService.endSession(session);
  }
}
