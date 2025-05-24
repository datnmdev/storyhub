import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';
import { Dispatch, SetStateAction } from 'react';

export interface NameSectionProps {
  chapterId: number;
  setRefetchChapterList: Dispatch<SetStateAction<{ value: boolean }>>;
}

export interface InputData extends InputDataType {
  name: string;
}

export interface InputError extends InputErrorType {
  name?: string;
}
