import {
  InputData as InputDataType,
  InputError as InputErrorType,
} from '@hooks/validate.hook';

export interface NotesSectionProps {
  storyId: number;
}

export interface InputData extends InputDataType {
  notes: string;
}

export interface InputError extends InputErrorType {
  notes?: string;
}
