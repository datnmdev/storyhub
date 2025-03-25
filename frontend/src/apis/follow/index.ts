import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const followApi = {
  getFollowerCount: (options: RequestInit) => {
    return axiosInstance().get('/follow/count', {
      params: options.queries,
    });
  },
  getFollow: (options: RequestInit) => {
    return axiosInstance().get('/follow', {
      params: options.queries,
    });
  },
  follow: (options: RequestInit) => {
    return axiosInstance().post('/follow', options.body);
  },
  unfollow: (options: RequestInit) => {
    return axiosInstance().delete('/follow', {
      params: options.queries,
    });
  },
};

export default followApi;
