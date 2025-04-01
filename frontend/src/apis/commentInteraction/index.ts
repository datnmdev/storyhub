import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

export interface CommentInteractionCountResponse {
  likeCount: number;
  dislikeCount: number;
}

const commentInteraction = {
  getCommentInteraction: (options: RequestInit) => {
    return axiosInstance().get('/comment-interaction', {
      params: options.queries,
    });
  },
  getCommentInteractionCount: (options: RequestInit) => {
    return axiosInstance().get('/comment-interaction/count', {
      params: options.queries,
    });
  },
  createCommentInteraction: (options: RequestInit) => {
    return axiosInstance().post('/comment-interaction', options.body);
  },
  updateCommentInteraction: (options: RequestInit) => {
    return axiosInstance().put('/comment-interaction', options.body);
  },
  deleteCommentInteraction: (options: RequestInit) => {
    return axiosInstance().delete('/comment-interaction', {
      params: options.queries,
    });
  },
};

export default commentInteraction;
