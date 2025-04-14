import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const aliasApi = {
  getAliasByStoryId: (options: RequestInit) => {
    return axiosInstance().get('/alias/get-by-story-id', {
      params: options.queries,
    });
  },
  updateAlias: (options: RequestInit) => {
    return axiosInstance().put('/alias', options.body, {
      params: options.queries,
    });
  },
};

export default aliasApi;
