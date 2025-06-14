import { Dispatch, SetStateAction } from 'react';

export interface FollowStoryItemProps {
  data: any;
  setReGetFollowList: Dispatch<SetStateAction<{ value: boolean }>>;
}
