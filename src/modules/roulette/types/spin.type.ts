export type IBet = {
  betAmount: number;
  betType: string | number;
};
export type ISpin = {
  winningNumber?: number;
  betInfo: IBet[];
};
