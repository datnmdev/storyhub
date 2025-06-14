import { PopupProps } from '@components/Popup/Popup.type';
import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';
import { Dispatch, SetStateAction } from 'react';

export interface UploadChapterTextContentPopupProps extends PopupProps {
  storyId: number;
  setRefetchChapterList?: Dispatch<SetStateAction<{ value: boolean }>>;
}

export interface InputData extends InputDataType {
  name: string;
  content: string;
}

export interface InputError extends InputErrorType {
  name?: string;
  content?: string;
}
