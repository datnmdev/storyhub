import { PropsWithChildren, ReactElement } from 'react';

export interface IconButtonProps extends PropsWithChildren {
  icon: ReactElement;
  fontSize?: string;
  color?: string;
  bgColor?: string;
  width?: number;
  height?: number;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  padding?: string;
  disable?: boolean;
  onClick?: () => void;
}
