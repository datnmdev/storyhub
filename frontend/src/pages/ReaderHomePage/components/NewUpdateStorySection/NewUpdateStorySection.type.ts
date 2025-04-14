import { Pagination } from '@components/Pagination/Pagination.type';
import { StoryStatus, StoryType } from '@constants/story.constants';

export interface Story {
  id: number;
  title: string;
  description: string;
  notes: string;
  coverImage: string;
  type: StoryType;
  status: StoryStatus;
  createdAt: Date;
  updatedAt: Date;
  countryId: number;
  authorId: number;
}

export type GetNewUpdatedStoriesResData = [Story[], number];

export interface GetNewUpdatedStoriesQueries extends Pagination {
  orderBy: string;
}
