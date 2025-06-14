import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface DescriptionSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  description: string;
}

export interface InputError extends InputErrorType {
  description?: string;
}
