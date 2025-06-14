import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from 'hooks/validate.hook';

export interface InputData extends InputDataType {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}

export interface InputError extends InputErrorType {
  oldPassword?: string;
  newPassword?: string;
  repeatNewPassword?: string;
}
