import { ChangeEventHandler, FocusEventHandler, ReactElement } from 'react';

export interface InputWithIconProps {
  icon?: ReactElement;
  type?: 'text' | 'password' | 'email' | 'date';
  placeholder?: string;
  value?: string;
  name?: string;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  length?: number;
  contentEditable?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}
