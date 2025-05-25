import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const priceApi = {
  getCurrentPrice: (options: RequestInit) => {
    return axiosInstance().get('/price/current', {
      params: options.queries,
    });
  },
  createPrice: (options: RequestInit) => {
    return axiosInstance().post('/price', options.body);
  },
};

export default priceApi;
