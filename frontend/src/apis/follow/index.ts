import { RequestInit } from '@apis/api.type';
import { AxiosResponse } from 'axios';
import axiosInstance from 'libs/axios';

const followApi = {
  getFollowerCount: (options: RequestInit): Promise<AxiosResponse<number>> => {
    return axiosInstance().get('/follow/count', {
      params: options.queries,
    });
  },
};

export default followApi;
