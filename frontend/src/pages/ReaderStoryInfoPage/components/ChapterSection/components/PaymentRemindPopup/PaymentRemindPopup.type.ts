import { Chapter } from '@apis/chapter';
import { PopupProps } from '@components/Popup/Popup.type';

export interface PaymentRemindPopupProps extends PopupProps {
  chapter: Chapter;
  price: number;
  selectChapterTransId: number;
}
