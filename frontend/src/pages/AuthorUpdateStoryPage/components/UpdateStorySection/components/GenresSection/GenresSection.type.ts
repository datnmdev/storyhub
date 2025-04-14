import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface GenresSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  genres: number[];
}

export interface InputError extends InputErrorType {
  genres?: string;
}
