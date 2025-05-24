import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface TitleSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  title: string;
}

export interface InputError extends InputErrorType {
  title?: string;
}
