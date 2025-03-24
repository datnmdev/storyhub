import { RequestInit } from '@apis/api.type';
import { AxiosResponse } from 'axios';
import axiosInstance from 'libs/axios';

export interface RatingSummary {
  starCount: number;
  ratingCount: number;
}

const ratingApi = {
  getRatingCount: (options: RequestInit): Promise<AxiosResponse<number>> => {
    return axiosInstance().get('/rating/count', {
      params: options.queries,
    });
  },
  getRatingSummary: (
    options: RequestInit
  ): Promise<AxiosResponse<RatingSummary>> => {
    return axiosInstance().get('/rating/summary', {
      params: options.queries,
    });
  },
};

export default ratingApi;
