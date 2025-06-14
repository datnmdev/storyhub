import { CSSProperties } from 'react';
import { ImageContentWithUrlPreview } from '../../UploadChapterImageContentPopup.type';

export interface ChapterImageInputProps {
  value?: ImageContentWithUrlPreview[];
  name?: string;
  contentEditable?: boolean;
  readOnly?: boolean;
  sx?: CSSProperties;
  onChange?: (value: ImageContentWithUrlPreview[]) => void;
}
