import { ChangeEventHandler, ReactElement } from 'react';

export interface InputWithIconProps {
  icon?: ReactElement;
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
