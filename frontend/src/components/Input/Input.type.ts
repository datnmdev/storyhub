import { ChangeEventHandler, CSSProperties, FocusEventHandler } from 'react';

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'date' | 'number';
  placeholder?: string;
  value?: string;
  name?: string;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  length?: number;
  contentEditable?: boolean;
  readOnly?: boolean;
  sx?: CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}
