import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const genreApi = {
  getGenreWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/genre/filter', {
      params: options.queries,
    });
  },
};

export default genreApi;
