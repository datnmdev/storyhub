import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface PriceSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  price: string;
}

export interface InputError extends InputErrorType {
  price?: string;
}
