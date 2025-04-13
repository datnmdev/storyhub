import { PopupProps } from '@components/Popup/Popup.type';
import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';
import { Dispatch, SetStateAction } from 'react';

export interface UploadStoryPopupProps extends PopupProps {
  setRefetchStoryList?: Dispatch<SetStateAction<{ value: boolean }>>;
}

export interface InputData extends InputDataType {
  title: string;
  alias: string[];
  description: string;
  type: string;
  notes: string;
  coverImage: string;
  countryId: string;
  price: string;
  genres: number[];
}

export interface InputError extends InputErrorType {
  title?: string;
  alias?: string;
  description?: string;
  type?: string;
  notes?: string;
  coverImage?: string;
  countryId?: string;
  price?: string;
  genres?: string;
}
