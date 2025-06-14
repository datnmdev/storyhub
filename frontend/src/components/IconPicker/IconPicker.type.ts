import { ReactElement } from 'react';

export interface IconSubject {
  icon: string;
  title: string;
  data: Array<string>;
}

export interface IconBoxProps {
  activatedIcon?: ReactElement;
  unactivatedIcon?: ReactElement;
  data: Array<IconSubject>;
  fontSize?: number;
  onClickedItem?: (data: HTMLImageElement) => void;
}
