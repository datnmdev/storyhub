import { CommentType } from '@constants/comment.constants';
import { Dispatch, SetStateAction } from 'react';

export interface CommentListProps {
  type: CommentType;
  storyId?: number;
  chapterId?: number;
  refresh?: { value: boolean };
  setTotalComment: Dispatch<SetStateAction<number>>;
}
