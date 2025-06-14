import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface InputData extends InputDataType {
  otp: string;
}

export interface InputError extends InputErrorType {
  otp?: string;
}

export interface ForgotPasswordResponseData {
  accountId: number;
  state: string;
}
