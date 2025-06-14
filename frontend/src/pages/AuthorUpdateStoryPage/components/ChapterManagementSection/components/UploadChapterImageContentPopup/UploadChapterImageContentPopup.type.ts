import { PopupProps } from '@components/Popup/Popup.type';
import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';
import { Dispatch, SetStateAction } from 'react';

export interface ImageContentWithUrlPreview {
  order: number;
  path: string;
  previewUrl: string;
}

export interface UploadChapterImageContentPopupProps extends PopupProps {
  storyId: number;
  setRefetchChapterList?: Dispatch<SetStateAction<{ value: boolean }>>;
}

export interface InputData extends InputDataType {
  name: string;
  imageContents: ImageContentWithUrlPreview[];
}

export interface InputError extends InputErrorType {
  name?: string;
  imageContents?: string;
}
