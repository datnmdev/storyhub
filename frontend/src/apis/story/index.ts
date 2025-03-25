import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const storyApi = {
  getStoryWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/story/filter', {
      params: options.queries,
    });
  },
  getGenres: (options: RequestInit) => {
    return axiosInstance().get('/story/get-genres', {
      params: options.queries,
    });
  },
};

export default storyApi;
