import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const storyApi = {
  getStoryWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/story/filter', {
      params: options.queries,
    });
  },
  getStoryWithFilterForAuthor: (options: RequestInit) => {
    return axiosInstance().get('/story/author/filter', {
      params: options.queries,
    });
  },
  getGenres: (options: RequestInit) => {
    return axiosInstance().get('/story/get-genres', {
      params: options.queries,
    });
  },
  search: (options: RequestInit) => {
    return axiosInstance().get('/story/search', {
      params: options.queries,
    });
  },
  softDeleteStory: (options: RequestInit) => {
    return axiosInstance().put(
      `/story/author/soft-delete/${options.params.storyId}`
    );
  },
  uploadStory: (options: RequestInit) => {
    return axiosInstance().post('/story', options.body);
  },
  updateStory: (options: RequestInit) => {
    return axiosInstance().put(
      `/story/${options.params.storyId}`,
      options.body
    );
  },
  getGenreDetailByStoryId: (options: RequestInit) => {
    return axiosInstance().get('/story/genre-detail', {
      params: options.queries,
    });
  },
  updateGenres: (options: RequestInit) => {
    return axiosInstance().put(
      `/story/${options.params.storyId}/genre-detail`,
      options.body
    );
  },
};

export default storyApi;
