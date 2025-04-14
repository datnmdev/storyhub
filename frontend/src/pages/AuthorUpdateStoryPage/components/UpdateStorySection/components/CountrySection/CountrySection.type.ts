import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface CountrySectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  countryId: string;
}

export interface InputError extends InputErrorType {
  countryId?: string;
}
