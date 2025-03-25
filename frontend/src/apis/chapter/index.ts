import { RequestInit } from '@apis/api.type';
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

export interface ChapterWithInvoiceRelation extends Chapter {
  invoices: any[];
}

export interface ChapterImage {
  id: number;
  order: number;
  path: string;
  chapterId: number;
}

export interface ImageContent {
  id: number;
  order: number;
  name: string;
  images: ChapterImage[];
  createdAt: string;
  updatedAt: string;
  storyId: number;
}

export type GetChapterWithFilterResponseData = [Chapter[], number];

const chapterApi = {
  getChapterWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/chapter/filter', {
      params: options.queries,
    });
  },
  getChapterContent: (options: RequestInit) => {
    return axiosInstance().get('/chapter/reader/content', {
      params: options.queries,
    });
  },
  getChapterWithInvoiceRelation: (options: RequestInit) => {
    return axiosInstance().get('/chapter/with-invoice-relation', {
      params: options.queries,
    });
  },
};

export default chapterApi;
