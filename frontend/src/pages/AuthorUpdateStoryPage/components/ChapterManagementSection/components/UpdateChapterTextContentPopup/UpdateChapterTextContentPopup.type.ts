import { PopupProps } from '@components/Popup/Popup.type';
import { Dispatch, SetStateAction } from 'react';

export interface UpdateChapterTextContentPopupProps extends PopupProps {
  chapterId: number;
  setRefetchChapterList: Dispatch<SetStateAction<{ value: boolean }>>;
}
