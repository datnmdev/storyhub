export enum DepositeTransactionStatus {
  INITIALIZE = 0,
  SUCCEED = 1,
  FAILED = 2,
}

export interface DepositeTransaction {
  id: number;
  transactionNo: string;
  bankTransNo: string;
  orderId: string;
  bankCode: string;
  cardType: string;
  amount: string;
  orderInfo: string;
  payDate: Date;
  status: DepositeTransactionStatus;
  createdAt: Date;
  readerId: number;
}

export type GetDepositeTransactionHistoryRes = [DepositeTransaction[], number];
