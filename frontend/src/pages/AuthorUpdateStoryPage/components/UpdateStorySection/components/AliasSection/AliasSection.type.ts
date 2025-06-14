import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface AliasSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  alias: string[];
}

export interface InputError extends InputErrorType {
  alias?: string;
}
