import { Dispatch, SetStateAction } from 'react';

export interface HistoryItemProps {
  data: any;
  setReGetHistory: Dispatch<SetStateAction<{ value: boolean }>>;
}
