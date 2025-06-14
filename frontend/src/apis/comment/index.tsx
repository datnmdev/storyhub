import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const commentApi = {
  createComment: (options: RequestInit) => {
    return axiosInstance().post('/comment', options.body);
  },
  getCommentWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/comment', {
      params: options.queries,
    });
  },
  updateComment: (options: RequestInit) => {
    return axiosInstance().put('/comment', options.body);
  },
  deleteComment: (options: RequestInit) => {
    return axiosInstance().delete(`/comment/${options.params.id}`);
  },
};

export default commentApi;
