import { PopupProps } from '@components/Popup/Popup.type';
import { Dispatch, SetStateAction } from 'react';

export interface ImageContentWithUrlPreview {
  order: number;
  path: string;
  previewUrl: string;
}

export interface UpdateChapterImageContentPopupProps extends PopupProps {
  chapterId: number;
  setRefetchChapterList: Dispatch<SetStateAction<{ value: boolean }>>;
}
