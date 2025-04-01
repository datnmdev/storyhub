import { CommentType } from '@constants/comment.constants';

export interface Comment {
  id: number;
  type: CommentType;
  content: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
  chapterId: number;
  storyId: number;
  readerId: number;
  reader: any;
}

export interface CommentProps {
  data: Comment;
  onDeleted?: (value: boolean) => void;
}
