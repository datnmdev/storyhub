import { Chapter } from '@apis/chapter';
import { PopupProps } from '@components/Popup/Popup.type';

export interface ChapterTransListPopupProps extends PopupProps {
  selectedChapter: Chapter;
  onChange: (chapterTransId: number) => void;
}
