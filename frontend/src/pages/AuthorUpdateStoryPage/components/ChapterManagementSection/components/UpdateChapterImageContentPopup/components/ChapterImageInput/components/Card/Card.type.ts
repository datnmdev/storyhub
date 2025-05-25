import { ImageContentWithUrlPreview } from '../../../../UpdateChapterImageContentPopup.type';

export const ItemTypes = {
  CARD: 'card',
};

export type DragItem = {
  id: string;
  originalIndex: number;
};

export interface CardProps {
  item: ImageContentWithUrlPreview;
  index: number;
  moveItem: (from: number, to: number) => void;
  onDeleteClick: () => void;
  isEditable?: boolean;
}
