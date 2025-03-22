import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const depositeTransactionApi = {
  createPaymentUrl: (options: RequestInit) => {
    return axiosInstance().post(
      '/deposite-transaction/create-payment-url',
      options.body
    );
  }
};

export default depositeTransactionApi;
