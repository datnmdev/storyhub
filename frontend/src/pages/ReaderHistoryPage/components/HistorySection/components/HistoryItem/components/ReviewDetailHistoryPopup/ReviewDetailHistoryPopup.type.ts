import { PopupProps } from '@components/Popup/Popup.type';
import { Dispatch, SetStateAction } from 'react';

export interface ReviewDetailHistoryPopupProps extends PopupProps {
  data: any;
  setReGetHistory: Dispatch<SetStateAction<{ value: boolean }>>;
}
