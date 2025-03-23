import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const depositeTransactionApi = {
  createPaymentUrl: (options: RequestInit) => {
    return axiosInstance().post(
      '/deposite-transaction/create-payment-url',
      options.body
    );
  },
  getDepositeTransHistory: (options: RequestInit) => {
    return axiosInstance().get(
      '/deposite-transaction/get-deposite-transaction-history',
      {
        params: options.queries,
      }
    );
  },
};

export default depositeTransactionApi;
