import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface InputData extends InputDataType {
  email: string;
  password: string;
}

export interface InputError extends InputErrorType {
  email?: string;
  password?: string;
}
