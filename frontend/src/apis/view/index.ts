import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const viewApi = {
  getViewCountOfStory: (options: RequestInit) => {
    return axiosInstance().get(`/view/count/story/${options.params.storyId}`);
  },
  getTopViewStory: (options: RequestInit) => {
    return axiosInstance().get(`/view/get-top`, {
      params: options.queries,
    });
  },
  getViewCountOfChapter: (options: RequestInit) => {
    return axiosInstance().get(
      `/view/count/chapter/${options.params.chapterId}`
    );
  },
};

export default viewApi;
