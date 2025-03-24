import { RequestInit } from '@apis/api.type';
import { AxiosResponse } from 'axios';
import axiosInstance from 'libs/axios';

export interface Chapter {
  id: number;
  order: number;
  name: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  storyId: number;
}

export type GetChapterWithFilterResponseData = [Chapter[], number];

const chapterApi = {
  getChapterWithFilter: (
    options: RequestInit
  ): Promise<AxiosResponse<GetChapterWithFilterResponseData>> => {
    return axiosInstance().get('/chapter/filter', {
      params: options.queries,
    });
  },
};

export default chapterApi;
