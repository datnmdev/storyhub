import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const historyApi = {
  getHistoryWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/history/filter', {
      params: options.queries,
    });
  },
  createHistory: (options: RequestInit) => {
    return axiosInstance().post('/history', options.body);
  },
  deleteHistoryByChapterTranslationId: (options: RequestInit) => {
    return axiosInstance().delete('/history/delete-by-chapter-translation-id', {
      params: options.queries,
    });
  },
  deleteHistoryByStoryId: (options: RequestInit) => {
    return axiosInstance().delete('/history/delete-by-story-id', {
      params: options.queries,
    });
  },
  deleteAllHistory: () => {
    return axiosInstance().delete('/history/all');
  },
};

export default historyApi;
