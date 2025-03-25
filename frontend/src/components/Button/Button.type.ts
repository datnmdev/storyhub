import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ButtonProps extends PropsWithChildren {
  width?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  borderRadius?: string;
  padding?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
