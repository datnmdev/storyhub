import { Comment } from '@components/Comment/Comment.type';

export interface RepliesProps {
  parent: Comment;
  refresh?: { value: boolean };
}
