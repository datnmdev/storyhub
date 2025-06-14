import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface InputData extends InputDataType {
  password: string;
  repeatPassword: string;
}

export interface InputError extends InputErrorType {
  password?: string;
  repeatPassword?: string;
}
