import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const invoiceApi = {
  getInvoice: (options: RequestInit) => {
    return axiosInstance().get('/invoice', {
      params: options.queries,
    });
  },
  createInvoice: (options: RequestInit) => {
    return axiosInstance().post('/invoice', options.body);
  },
};

export default invoiceApi;
