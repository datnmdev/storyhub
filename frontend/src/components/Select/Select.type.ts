import { SelectChangeEvent } from '@mui/material';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';

export interface SelectProps extends PropsWithChildren {
  name?: string;
  value?: string;
  border?: string;
  sx?: CSSProperties;
  onChange?: (event: SelectChangeEvent<string>, child: ReactNode) => void;
}
