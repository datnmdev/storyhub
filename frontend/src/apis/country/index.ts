import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

export interface Country {
  id: number;
  name: string;
}

const countryApi = {
  getCountries: (options: RequestInit) => {
    return axiosInstance().get('/country', {
      params: options.queries,
    });
  },
};

export default countryApi;
