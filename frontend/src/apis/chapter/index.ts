import { RequestInit } from '@apis/api.type';
import { Country } from '@apis/country';
import { ChapterStatus } from '@constants/chapter.constant';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import axiosInstance from 'libs/axios';

export interface ChapterTranslation {
  id: number;
  chapterId: number;
  countryId: number;
  translatorId: number;
}

export interface Chapter {
  id: number;
  order: number;
  status: ChapterStatus;
  name: string;
  chapterTranslations: ChapterTranslation[];
  createdAt: string;
  updatedAt: string;
  storyId: number;
  story: Story;
}

export interface ChapterWithInvoiceRelation extends Chapter {
  invoices: any[];
}

export interface TextContent {
  chapterTranslationId: number;
  content: string;
}

export interface ImageContent {
  id: number;
  order: number;
  path: string;
  chapterTranslationId: number;
}

export interface ChapterTranslation extends Chapter {
  images: ImageContent[];
  text: TextContent;
  history: any;
  country: Country;
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
  getImage: (options?: RequestInit) => {
    return axiosInstance().get(options?.uri as string, {
      responseType: 'blob',
    });
  },
  getChapterWithInvoiceRelation: (options: RequestInit) => {
    return axiosInstance().get('/chapter/with-invoice-relation', {
      params: options.queries,
    });
  },
  getChapterTranslation: (options: RequestInit) => {
    return axiosInstance().get(
      `/chapter/${options.params.chapterId}/translations`
    );
  },
  getChapterForAuthorWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/chapter/author/filter', {
      params: options.queries,
    });
  },
  softDeleteChapter: (options: RequestInit) => {
    return axiosInstance().put(
      `/chapter/author/soft-delete/${options.params.chapterId}`
    );
  },
  uploadChapter: (options: RequestInit) => {
    return axiosInstance().post('/chapter', options.body);
  },
  updateChapter: (options: RequestInit) => {
    return axiosInstance().put(
      `/chapter/${options.params.chapterId}`,
      options.body
    );
  },
};

export default chapterApi;
