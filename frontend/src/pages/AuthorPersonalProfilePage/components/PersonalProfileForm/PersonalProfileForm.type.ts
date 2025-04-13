import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from 'hooks/validate.hook';

export interface InputData extends InputDataType {
  name: string;
  dob: string | undefined;
  gender: string | undefined;
  phone: string;
}

export interface InputError extends InputErrorType {
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
}
