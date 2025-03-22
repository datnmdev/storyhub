import { PopupProps } from '@components/Popup/Popup.type';
import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface DepositePopupProps extends PopupProps {}

export interface InputData extends InputDataType {
  amount: string;
  bankCode: string;
}

export interface InputError extends InputErrorType {
  amount?: string;
  bankCode?: string;
}
