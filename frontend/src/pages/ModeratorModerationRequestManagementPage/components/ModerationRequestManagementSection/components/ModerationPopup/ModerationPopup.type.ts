import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface InputData extends InputDataType {
  reason: string;
}

export interface InputError extends InputErrorType {
  reason?: string;
}
