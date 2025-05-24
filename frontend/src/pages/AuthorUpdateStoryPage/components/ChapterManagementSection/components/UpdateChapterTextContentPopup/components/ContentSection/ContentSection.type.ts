import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface ContentSectionProps {
  chapterId: number;
}

export interface InputData extends InputDataType {
  content: string;
}

export interface InputError extends InputErrorType {
  content?: string;
}
