import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from 'hooks/validate.hook';

export interface InputData extends InputDataType {
  type: string;
  email: string;
  name: string;
  dob: string | undefined;
  gender: string;
  phone: string;
  password: string;
  repeatPassword: string;
  countryId: string;
}

export interface InputError extends InputErrorType {
  type: string;
  email?: string;
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  password?: string;
  repeatPassword?: string;
  countryId?: string;
}
