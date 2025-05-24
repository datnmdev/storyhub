import { CSSProperties } from 'react';
import { ImageContentWithUrlPreview } from '../../UpdateChapterImageContentPopup.type';

export interface ChapterImageInputProps {
  mode: 'view' | 'edit'
  value?: ImageContentWithUrlPreview[];
  name?: string;
  contentEditable?: boolean;
  readOnly?: boolean;
  sx?: CSSProperties;
  onChange?: (value: ImageContentWithUrlPreview[]) => void;
}
