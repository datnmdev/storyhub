import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

export interface RatingSummary {
  starCount: number;
  ratingCount: number;
}

const ratingApi = {
  getRatingCount: (options: RequestInit) => {
    return axiosInstance().get('/rating/count', {
      params: options.queries,
    });
  },
  getRatingSummary: (options: RequestInit) => {
    return axiosInstance().get('/rating/summary', {
      params: options.queries,
    });
  },
  getRating: (options: RequestInit) => {
    return axiosInstance().get('/rating', {
      params: options.queries,
    });
  },
  createRating: (options: RequestInit) => {
    return axiosInstance().post('/rating', options.body);
  },
  updateRating: (options: RequestInit) => {
    return axiosInstance().put('/rating', options.body);
  },
};

export default ratingApi;
