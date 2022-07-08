import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { jwtBalance } from './types/jwt.type';
import { gameMode } from './enum/gameMode.enum';
import { betType } from './enum/betType.enum';
import { IBet, ISpin } from './types/spin.type';
import { ICreateSession } from './types/createSession.type';
import { Session } from 'express-session';
import { ISessionAccount } from './types/account.type';

@Injectable()
export class RouletteService {
  constructor() {}

  async createSession(
    dto: ICreateSession,
    jwtBalance: jwtBalance,
    session: Session,
  ) {
    try {
      let balance: number = 0;
      // check game mode and add balance
      if (dto.gameMode === gameMode.NORMAL) {
        balance = jwtBalance.balance;
      } else {
        balance = dto.balance;
      }

      session.account = {
        sessionId: session.id,
        gameMode: dto.gameMode,
        startBalance: balance,
        endBalance: balance,
      };
      return { message: 'Account created successfully' };
    } catch (error) {}
  }

  async spin(dto: ISpin, session: any) {
    try {
      // if (!session.account) {
      //   throw new BadRequestException('You need to create an account to bet');
      // }
      const userAccount: ISessionAccount = session.account;
      // generate random winning number if game mode is NORMAL
      // else get winning number form the body
      // and if the winning number is not presented, then generate it
      const winningNumber: number =
        userAccount.gameMode === gameMode.NORMAL
          ? Math.floor(Math.random() * 37)
          : dto.winningNumber
          ? dto.winningNumber
          : Math.floor(Math.random() * 37);
      let winAmount: number = 0;
      const responseData = [];
      let totalAmount: number = 0;
      const addBetsToResponseData = async (bet: IBet, win: boolean) => {
        responseData.push({
          ...bet,
          win,
        });
      };

      // The sum of the amount placed on the bets
      dto.betInfo.map((bet) => {
        totalAmount += bet.betAmount;
      });
      // check if user has enough money to make bets
      if (userAccount.endBalance < totalAmount) {
        throw new BadRequestException('There is not enough money');
      }

      for await (const bet of dto.betInfo) {
        const isOdd = bet.betType === betType.ODD && winningNumber % 2 !== 0;
        const isEven = bet.betType === betType.EVEN && winningNumber % 2 === 0;
        const numberMatch = bet.betType === winningNumber;
        if (isOdd || isEven) {
          winAmount += bet.betAmount;
          addBetsToResponseData(bet, true);
        } else if (numberMatch) {
          winAmount += bet.betAmount * 35;
          addBetsToResponseData(bet, true);
        } else {
          winAmount -= bet.betAmount;
          addBetsToResponseData(bet, false);
        }
      }

      userAccount.endBalance += winAmount;
      return { bets: responseData, balance: userAccount.endBalance };
    } catch (err) {
      throw err;
    }
  }
  async endSession(session: Session) {
    try {
      const { startBalance, endBalance } = session.account;
      session.destroy((err) => {});
      return { startBalance, endBalance };
    } catch (err) {
      throw err;
    }
  }
}
