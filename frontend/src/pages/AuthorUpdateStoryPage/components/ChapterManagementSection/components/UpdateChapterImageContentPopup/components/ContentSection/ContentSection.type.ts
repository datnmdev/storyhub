import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';
import { ImageContentWithUrlPreview } from '../../UpdateChapterImageContentPopup.type';

export interface ContentSectionProps {
  chapterId: number;
}

export interface InputData extends InputDataType {
  imageContents: ImageContentWithUrlPreview[];
}

export interface InputError extends InputErrorType {
  imageContents?: string;
}
