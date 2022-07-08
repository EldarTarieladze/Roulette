import { ISessionAccount } from 'src/modules/roulette/types/account.type';
// for TS I added an account field to the session object
declare module 'express-session' {
  interface Session {
    account: ISessionAccount;
  }
}
