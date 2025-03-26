export interface Invoice {
  id: number;
  readerId: number;
  chapterId: number;
  totalAmount: string;
  createdAt: string;
}

export type GetInvoiceHistoryRes = [Invoice[], number];
